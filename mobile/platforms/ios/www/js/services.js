angular.module('caffeina.services', ['firebase'])


    .factory('dmlservice', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', '$q', function ($firebase, $firebaseSimpleLogin, firebaseRef, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , dmlService = {}
            ;

        dmlService._now = function () {
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        };

        dmlService._isLogged = function () {
            return (user.user && user.user.email) ? true : false;
        };

        dmlService._add = function (fbRef, objToAdd, objPriority) {
            var now = dmlService._now()
                , newId = 0
                , deferred = $q.defer()
                ;

            objToAdd.createdAt = now;
            objToAdd.updatedAt = now;
            objToAdd.version = 1;
            objToAdd.isDeleted = false;

            fbRef.child('counter').transaction(function (currValue) {
                return (currValue || 0) + 1;
            }, function (err, commited, identity) {
                if (err) {
                    deferred.reject('Counter error');
                } else {
                    if (commited) {
                        newId = identity.val();
                        fbRef.child(newId).setWithPriority(objToAdd, objPriority, function () {
                            deferred.resolve(newId);
                        });
                    } else {
                        deferred.reject('Counter error (not commited)');
                    }
                }
            });
            return deferred.promise;
        };

        dmlService._upd = function (fbRef, objToUpd, objId, objPriority) {
            var now = dmlService._now()
                , deferred = $q.defer()
                ;
            fbRef.child(objId).once('value', function (objSnapshoot) {
                var dataSnapshoot = objSnapshoot.val()
                    ;
                if (dataSnapshoot) {
                    if (dataSnapshoot.isDeleted) {
                        deferred.reject('_upd error: object is deleted')
                    } else {
                        objToUpd.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        objToUpd.updatedAt = now;
                        objToUpd.version = (dataSnapshoot.version || 0) + 1;
                        objToUpd.isDeleted = false;
                        fbRef.child(objId).setWithPriority(objToUpd, objPriority, function () {
                            deferred.resolve(objId);
                        });
                    }
                } else {
                    dmlService._add(fbRef, objToUpd, objPriority).then(function (newId) {
                        deferred.resolve(newId);
                    }, function (error) {
                        deferred.reject('_upd error: _add error');
                    })
                }
            });
            return deferred.promise;
        };

        dmlService._del = function (fbRef, objId) {
            var now = dmlService._now()
                , deferred = $q.defer()
                ;
            fbRef.child(objId).once('value', function (objSnapshoot) {
                var dataSnapshoot = objSnapshoot.val()
                    , objPriority = objSnapshoot.getPriority()
                    ;
                if (dataSnapshoot) {
                    if (dataSnapshoot.isDeleted) {
                        deferred.reject('_del error: object already deleted');
                    } else {
                        dataSnapshoot.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        dataSnapshoot.updatedAt = now;
                        dataSnapshoot.version = -((dataSnapshoot.version || 0) + 1);
                        dataSnapshoot.isDeleted = true;
                        fbRef.child(objId).setWithPriority(dataSnapshoot, objPriority, function () {
                            deferred.resolve(objId);
                        })
                    }
                } else {
                    deferred.reject('_del error: object not found');
                }
            });
            return deferred.promise;
        };

        // refs
        dmlService._rootFBRef = function () {
            return firebaseRef('/');
        };

        dmlService._rootTemplateFBRef = function () {
            return firebaseRef('/templates/');
        };

        dmlService._userRootFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/');
        };

        dmlService._templateFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/templates/');
        };

        dmlService._taskTemplateFBRef = function (templId) {
            return firebaseRef('/users/' + btoa(user.user.email) + '/templates/' + templId + '/tasks/');
        };


        dmlService._contactFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/contacts/');
        };

        dmlService._jobsFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/jobs/');
        };

        dmlService._tasksFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/tasks/');
        };


        dmlService._specificTaskFBRef = function (key) {
            return firebaseRef('/users/' + btoa(user.user.email) + '/tasks/' + key);
        };


        dmlService._userMessagesFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/messages/');
        };

        dmlService._getRootTemplate = function () {
            var deferred = $q.defer()
                , rootFBRef = dmlService._rootFBRef()
                , arrayRet = []
                ;

            rootFBRef.child('templates').once('value', function (templateSnapsoot) {
                var templateObj = templateSnapsoot.val()
                    ;
                _.each(templateObj, function (template) {
                    if (template.name) {
                        var tasks = []
                            ;
                        _.each(template.tasks, function (task) {
                            if (task.name) {
                                tasks.push({
                                    name: task.name,
                                    shift: task.shift,
                                    isMain: task.isMain,
                                    alert: task.alert
                                });
                            }
                        });
                        arrayRet.push({
                            name: template.name,
                            tasks: tasks
                        });
                    }
                });
                deferred.resolve(arrayRet);
            });
            return deferred.promise;
        };

        // public
        dmlService.setInitTemplate = function () {
            var templFBRef = dmlService._templateFBRef()
                , rootFBRef = dmlService._userRootFBRef()
                , deferred = $q.defer()
                , promise = deferred.promise
                , cnt = 0
                , templates = []
                ;

            promise = promise.then(function () {
                return rootFBRef.child('templates').remove();
            }).then(function () {
                return dmlService._getRootTemplate();
            }).then(function (arrayTemplate) {
                _.each(arrayTemplate, function (elemTemplate) {
                    templates.push(elemTemplate);
                });
            }).then(function () {
                _.each(templates, function (template) {
                    promise = promise.then(function () {
                        return dmlService._add(templFBRef, {name: template.name}, null).then(function (tmplId) {
                            var deferred2 = $q.defer()
                                , promise2 = deferred2.promise
                                ;
                            _.each(template.tasks, function (task) {
                                promise2 = promise2.then(function () {
                                    var ref = dmlService._taskTemplateFBRef(tmplId);
                                    return dmlService._add(ref, task, null);
                                })
                            });
                            deferred2.resolve(0);
                            return promise2;
                        });
                    });
                });
            });
            deferred.resolve(cnt);
            return deferred.promise;
        };

        dmlService.getContact = function (contact) {
            var deferred = $q.defer()
                , contactId = (contact || {}).id ? contact.id : 0
                , contactRef = dmlService._contactFBRef()
                , newContact = {}
                ;
            contactRef.child(contactId).once('value', function (contactSnapshoot) {
                if (contactSnapshoot.val()) {
                    deferred.resolve(contactId);
                } else {
                    newContact.name = contact.name ? contact.name : 'unknown';
                    if (contact.phone) newContact.phone = contact.phone;
                    if (contact.email) newContact.email = contact.email;
                    if (contact.details) newContact.details = contact.details;
                    dmlService._add(contactRef, newContact, newContact.name).then(function (newId) {
                        deferred.resolve(newId);
                    });
                }
            });
            return deferred.promise;
        };

        dmlService.jobGenerateTasks = function (jobId, templateId, jobDate, jobLocation) {
            var typeRef = dmlService._templateFBRef()
                , taskRef = dmlService._tasksFBRef()
                , deferred = $q.defer()
                , promise = deferred.promise
                , tasks = []
                , taskIds = []
                ;

            typeRef.child(templateId).once('value', function (templateSnapsoot) {
                var xData = _.pairs(templateSnapsoot.val().tasks);
                if (xData) {
                    _.each(xData, function (taskArr) {
                        var newTask = {}
                            , task = {}
                            ;
                        if (taskArr[0] != 'counter') {
                            task = taskArr[1];
                            task.id = taskArr[0];
                            if (!(task.isDeleted)) {
                                newTask.jobId = jobId;
                                newTask.taskTemplateId = task.id;
                                newTask.name = task.name;
                                if (task.isMain) {
                                    newTask.date = jobDate;
                                    if (jobLocation) newTask.location = jobLocation;
                                } else {
                                    newTask.date = moment(jobDate).add('days', task.shift).format('YYYY-MM-DD HH:mm:ss.SSS');
                                }
                                newTask.alert = task.alert;
                                tasks.push(newTask);
                            }
                        }
                    });

                    _.each(tasks, function (task) {
                        promise = promise.then(function () {
                            return dmlService._add(taskRef, task, task.date);
                        }).then(function (taskId) {
                            taskIds.push(taskId);
                        });
                    });

                    promise = promise.then(function () {
                        var jobRef = dmlService._jobsFBRef()
                            ;
                        jobRef.child(jobId).update({isTasksGenerated: true, tasks: taskIds.join(',')});
                    });

                    deferred.resolve(taskIds.length);

                } else {
                    deferred.reject('Inexistent type');
                }
            });
            return deferred.promise;
        };

        dmlService.delJobTasks = function (tasks) {
            var taskRef = dmlService._tasksFBRef()
                , deferred = $q.defer()
                , promise = deferred.promise
                ;
            _.each(tasks, function (taskId) {
                promise = promise.then(function () {
                    return dmlService._del(taskRef, taskId);
                });
            });
            deferred.resolve(tasks.length);
            return deferred.promise;
        };

        dmlService.delJob = function (jobId) {
            var jobRef = dmlService._jobsFBRef()
                ;
            jobRef.child(jobId).once('value', function (jobSnapshoot) {
                var job = jobSnapshoot.val()
                    , tasks
                    ;
                if (job) {
                    tasks = job.tasks.toString().split(',');
                    dmlService.delJobTasks(tasks).then(function () {
                        return dmlService._del(jobRef, jobId);
                    });
                }
            });
        };

        dmlService.setJob = function (job) {
            var jobRef = dmlService._jobsFBRef()
                ;
            if (dmlService._isLogged()) {
                if (!(job.contact)) {
                    job.contact = {name: 'unknown'};
                }
                dmlService.getContact(job.contact).then(function (contactId) {
                    var newJob = {}
                        ;
                    newJob.contactId = contactId;
                    newJob.type = job.type;
                    newJob.typeId = job.typeId;
                    newJob.isBooked = job.isBooked;
                    newJob.notes = job.notes;
                    newJob.date = job.date;

                    if (job.details) newJob.details = job.details;
                    if (job.isTasksGenerated) newJob.isTasksGenerated = job.isTasksGenerated;
                    if (job.tasks) newJob.tasks = job.tasks; // memorez lista de task-uri pt eventualitatea ca se face update pe un job cu taskuri deja generate

                    if (job.id) {
                        return dmlService._upd(jobRef, newJob, job.id, job.type);
                    } else {
                        return dmlService._add(jobRef, newJob, job.type);
                    }
                }).then(function (jobId) {
                        var newTask = {}
                            , taskRef = dmlService._tasksFBRef()
                            , taskId
                            ;
                        if (job.isBooked) {
                            if (job.isTasksGenerated) {
                                // nu fac nimic pe task-uri
                            } else {
                                // tb sters task-ul vechi...
                                // generez task-uri
                                if (job.tasks) {
                                    taskId = job.tasks.toString().split(',')[0];
                                    return dmlService._del(taskRef, taskId).then(function () {
                                        return dmlService.jobGenerateTasks(jobId, job.typeId, job.date, job.location);
                                    });
                                } else {
                                    return dmlService.jobGenerateTasks(jobId, job.typeId, job.date, job.location);
                                }
                            }
                        } else {

                            newTask.jobId = jobId;
                            newTask.name = job.type;
                            newTask.isMain = true;
                            newTask.date = job.date;
                            if (job.location) newTask.location = job.location;

                            if (job.tasks) {
                                // iau primul task; oricum ar tb sa fie exact unul
                                // daca exista ii fac update daca nu il adaug
                                taskId = job.tasks.toString().split(',')[0];
                                return dmlService._upd(taskRef, newTask, taskId, newTask.date).then(function (taskId) {
                                    jobRef.child(jobId).update({tasks: taskId});
                                });
                            } else {
                                //new task
                                return dmlService._add(taskRef, newTask, newTask.date).then(function (taskId) {
                                    jobRef.child(jobId).update({tasks: taskId});
                                });
                            }
                        }
                    }
                ).then(function (ceva) {
                        console.log('end');
                        console.log(moment().format('mm:ss.sss'));
                        console.log(ceva);
                    });
            }
            else {
                //fixme:
                console.log('setJob error: user not loged in');
            }
        };

        dmlService.getTaskJob = function (task) {
            var deferred = $q.defer()
                , jobRef = dmlService._jobsFBRef()
                , contactRef = dmlService._contactFBRef()
                ;
            jobRef.child(task.jobId).once('value', function (jobSnapshoot) {
                task.jobObject = jobSnapshoot.val();
                task.jobObject.id = task.jobId;
                contactRef.child(task.jobObject.contactId).once('value', function (contactSnapshoot) {
                    task.jobObject.contactObject = contactSnapshoot.val();
                    task.jobObject.contactObject.id = task.jobObject.contactId;
                    deferred.resolve(task);
                });
            });
            return deferred.promise;
        };

        dmlService.getTasks = function (year, month) {
            var startAt = moment(year + '-' + month + '-1', 'YYYY-MM-DD').format('YYYY-MM-DD')
                , endAt = moment(year + '-' + month + '-1', 'YYYY-MM-DD').add('months', 1).add('days', -1).format('YYYY-MM-DD')
                , taskRef = dmlService._tasksFBRef()
                , promises = []
                , deferred = $q.defer()
                ;

            taskRef.startAt(startAt).endAt(endAt).once('value', function (tasksSnapshoot) {
                var tasks = []
                    ;
                _.each(_.pairs(tasksSnapshoot.val()), function (element) {
                    element[1].id = element[0];
                    tasks.push(element[1]);
                });
                _.each(tasks, function (task) {
                    if (task) {
                        if (!(task.isDeleted)) {
                            promises.push(dmlService.getTaskJob(task));
                        }
                    }
                });
                deferred.resolve(promises);
            });
            return $q.all([deferred.promise]).then(function () {
                return $q.all(promises);
            });
        };
        return dmlService;
    }])
;