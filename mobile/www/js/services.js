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
            }, function (error, commited, identity) {
                if (error) {
                    deferred.reject('dmlservice/_add: ' + error);
                } else {
                    if (commited) {
                        newId = identity.val();
                        fbRef.child(newId).setWithPriority(objToAdd, objPriority, function (error) {
                            if (error) {
                                deferred.reject('dmlservice/_add: ' + error);
                            } else {
                                deferred.resolve(newId);
                            }
                        });
                    } else {
                        deferred.reject('dmlservice/_add: not commited');
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
                        deferred.reject('dmlservice/_upd: object is deleted')
                    } else {
                        objToUpd.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        objToUpd.updatedAt = now;
                        objToUpd.version = (dataSnapshoot.version || 0) + 1;
                        objToUpd.isDeleted = false;
                        fbRef.child(objId).setWithPriority(objToUpd, objPriority, function (error) {
                            if (error) {
                                deferred.reject('dmlservice/_upd: ' + error);
                            } else {
                                deferred.resolve(objId);
                            }
                        });
                    }
                } else {
                    dmlService._add(fbRef, objToUpd, objPriority).then(function (newId) {
                        deferred.resolve(newId);
                    }, function (error) {
                        deferred.reject({method: "dmlservice/_upd", error: error});
                    });
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
                        deferred.reject('dmlservice/_del: object already deleted');
                    } else {
                        dataSnapshoot.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        dataSnapshoot.updatedAt = now;
                        dataSnapshoot.version = -((dataSnapshoot.version || 0) + 1);
                        dataSnapshoot.isDeleted = true;
                        fbRef.child(objId).setWithPriority(dataSnapshoot, objPriority, function (error) {
                            if (error) {
                                deferred.reject('dmlservice/_del: ' + error);
                            } else {
                                deferred.resolve(objId);
                            }
                        })
                    }
                } else {
                    deferred.reject('dmlservice/_del error: object not found for delete');
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

        dmlService._fileRef = function () {
            return firebaseRef('/files/');
        };

        dmlService._rootSettingsFBRef = function () {
            return firebaseRef('/settings/');
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

        dmlService._userMessagesFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/messages/');
        };

        dmlService._settingRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/settings/');
        };

        dmlService._inventoryRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/inventory/');
        };


        // privs
        dmlService._getRootSettings = function () {
            var deferred = $q.defer()
                , rootRef = dmlService._rootSettingsFBRef()
                ;
            rootRef.once('value', function (dataSnapshot) {
                deferred.resolve(dataSnapshot.val());
            });
            return deferred.promise;
        };

        dmlService._getRootTemplate = function () {
            var deferred = $q.defer()
                , rootFBRef = dmlService._rootFBRef()
                , arrayRet = []
                ;

            rootFBRef.child('templates').once('value', function (templateSnapshot) {
                var templateObj = _.pairs(templateSnapshot.val())
                    ;
                _.each(templateObj, function (template) {
                    if (template[1].name) {
                        var tasks = []
                            ;
                        _.each(_.pairs(template[1].tasks), function (task) {
                            if (task[1].name) {
                                tasks.push(task[1]);
                            }
                        });
                        template[1].tasks = tasks;
                        arrayRet.push(template[1]);
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
                        return dmlService._add(templFBRef, {name: template.name, color: template.color, autoBooked: (template.autoBooked || false)}, null).then(function (tmplId) {
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
                        }, function (error) {
                            deferred.reject('dmlservice/setInitTemplate(0): ' + error);
                        });
                    });
                });
            }, function (error) {
                deferred.reject('dmlservice/setInitTemplate(1): ' + error);
            });
            deferred.resolve(cnt);
            return deferred.promise;
        };

        dmlService.setInitKeys = function () {
            var deferred = $q.defer()
                , promise = deferred.promise
                , rootRef = dmlService._rootSettingsFBRef()
                , userSettingsRef = dmlService._settingRef()
                ;
            promise = promise.then(function () {
                return dmlService._getRootSettings();
            }).then(function (settings) {
                _.each(_.pairs(settings), function (key) {
                    promise = promise.then(function () {
                        return dmlService.getKey(key[0]).then(function (value) {
                            if (!(value)) {
                                value = key[1];
                            }
                            return dmlService.setKey(key[0], value);
                        });
                    });
                })
            }, function (error) {
                deferred.reject('dmlservice/setInitKeys: ' + error);
            });
            deferred.resolve(0);
            return deferred.promise;
        };

        dmlService.getContact = function (contact) {
            var deferred = $q.defer()
                , contactId = (contact || {}).id ? contact.id : 0
                , contactRef = dmlService._contactFBRef()
                , newContact = {}
                ;
            contact = contact || {};
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
                    }, function (error) {
                        deferred.reject('dmlservice/getContact: ' + error);
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
                                newTask.alarm = task.alarm;
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
                    }, function (error) {
                        deferred.reject('dmlservice/jobGenerateTasks: ' + error);
                    });
                    deferred.resolve(taskIds.length);
                } else {
                    deferred.reject('dmlservice/jobGenerateTasks: Inexistent type');
                }
            });
            return deferred.promise;
        };

        dmlService.delJobTasks = function (tasks) {
            var taskRef = dmlService._tasksFBRef()
                , deferred = $q.defer()
                , promise = deferred.promise
                , cnt = 0
                ;
            _.each(tasks, function (taskId) {
                promise = promise.then(function () {
                    return dmlService._del(taskRef, taskId);
                }).then(function () {
                    cnt++;
                }, function (error) {
                    deferred.reject('dmlservice/delJobTasks: ' + error);
                });
            });
            deferred.resolve(cnt);
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
                    }, function (error) {
                        deferred.reject('dmlservice/delJob: ' + error);
                    });
                }
            });
        };

        dmlService.setJob = function (job) {
            var jobRef = dmlService._jobsFBRef()
                , deferred = $q.defer()
                , jobId = job.id
                ;

            if (dmlService._isLogged()) {
                if (!((job.contact || {}))) {
                    job.contact = {name: 'unknown'};
                }
                dmlService.getContact(job.contact).then(function (contactId) {
                    jobId = job.id;
                    delete job["contact"];
                    job.contactId = contactId;
                    if (jobId) {
                        delete job["id"];
                        return dmlService._upd(jobRef, job, jobId, job.type.name);
                    } else {
                        return dmlService._add(jobRef, job, job.type.name);
                    }
                }).then(function (jobIdSaved) {
                    jobId = jobIdSaved;
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
                                    var jobLocation = "";
                                    if (job.details) if (job.details.location) jobLocation = job.details.location;
                                    return dmlService.jobGenerateTasks(jobId, job.type.id, job.date, jobLocation);
                                });
                            } else {
                                var jobLocation = "";
                                if (job.details) if (job.details.location) jobLocation = job.details.location;
                                return dmlService.jobGenerateTasks(jobId, job.type.id, job.date, jobLocation);
                            }
                        }
                    } else {

                        newTask.jobId = jobId;
                        newTask.name = job.type.name;
                        newTask.isMain = true;
                        newTask.date = job.date;
                        if (job.details) if (job.details.location) newTask.location = job.details.location;
                        if (job.details) if (job.details.alarm) newTask.alarm = job.details.alarm;

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
                }).then(function () {
                    deferred.resolve(jobId);
                }, function (error) {
                    deferred.reject('dmlservice/setJob: ' + error);
                }).then(function () {
                    console.log('end');
                    console.log(moment().format('mm:ss.sss'));
                });
            }
            else {
                deferred.reject('dmlservice/setJob: not logged in')
            }
            return deferred.promise;
        };

        dmlService.getTaskJob = function (task) {
            var deferred = $q.defer()
                , jobRef = dmlService._jobsFBRef()
                , contactRef = dmlService._contactFBRef()
                ;
            jobRef.child(task.jobId).once('value', function (jobSnapshoot) {
                task.jobObject = jobSnapshoot.val();
                task.jobObject.id = task.jobId;
                // converts date
                task.date = new Date(task.date);

                //reads contacts
                contactRef.child(task.jobObject.contactId).once('value', function (contactSnapshoot) {
                    task.jobObject.contactObject = contactSnapshoot.val();
                    task.jobObject.contactObject.id = task.jobObject.contactId;
                    deferred.resolve(task);
                });
            });
            return deferred.promise;
        };

        dmlService._doPromise = function (object) {
            var deferred = $q.defer()
                ;
            deferred.resolve(object);
            return deferred.promise;
        };

        dmlService.getTask = function (taskId) {
            var taskRef = dmlService._tasksFBRef()
                , deferred = $q.defer()
                ;
            taskRef.child(taskId).once('value', function (taskSnapshoot) {
                deferred.resolve(taskSnapshoot.val());
            });
            return deferred.promise;
        };

        dmlService.getJobTasks = function (jobId) {
            var jobRef = dmlService._jobsFBRef()
                , taskRef = dmlService._tasksFBRef()
                , deferred = $q.defer()
                , promises = []
                ;
            jobRef.child(jobId).once('value', function (jobSnapshoot) {
                if (jobSnapshoot.val()) {
                    _.each(jobSnapshoot.val().tasks.toString().split(','), function (taskId) {
                        promises.push(dmlService.getTask(taskId));
                    });
                    deferred.resolve(promises);
                } else {
                    deferred.reject("invalid job");
                }
            });
//            return deferred.promise;
            return $q.all([deferred.promise]).then(function () {
                return $q.all(promises);
            }, function (error) {
                deferred.reject('dmlservice/getTasks: ' + error);
            });
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
//                    element[1].date = moment(element[1].date).format("YYYY-MM-DDTHH:mm:ss.sssZ");
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
            }, function (error) {
                deferred.reject('dmlservice/getTasks: ' + error);
            });
        };


        dmlService.userTemplates = [];

        dmlService.getUserTemplates = function () {
            var templateRef = dmlService._templateFBRef()
                , deferred = $q.defer()
                ;
            templateRef.once('value', function (templateSnapshot) {
                if (dmlService.userTemplates.length) dmlService.userTemplates = [];
                _.each(_.pairs(templateSnapshot.val()), function (element) {
                    if (element[1].name) {
                        dmlService.userTemplates.push({
                            name: element[1].name,
                            id: element[0],
                            color: element[1].color,
                            autoBooked: (element[1].autoBooked || false)
                        });
                    }
                });
                deferred.resolve();
            });
            return $q.all([deferred.promise]);
        };

        dmlService.setKey = function (key, value) {
            var sRef = dmlService._settingRef()
                , deferred = $q.defer()
                ;
            sRef.child(key).set(value, function (error) {
                if (error) {
                    deferred.reject('dmlservice/setKey:' + error);
                } else {
                    deferred.resolve(0);
                }
            });
            return deferred.promise;
        };

        dmlService.getKey = function (key) {
            var sRef = dmlService._settingRef()
                , deferred = $q.defer()
                ;
            sRef.child(key).once('value', function (dataSnapshot) {
                var ret = dataSnapshot.val()
                    ;
                if (!(ret)) ret = "";
                deferred.resolve(ret);
            });
            return deferred.promise;
        };

        dmlService.delKey = function (key) {
            var sRef = dmlService._settingRef()
                , deferred = $q.defer()
                ;
            sRef.child(key).remove(function () {
                deferred.resolve(0);
            });
            return deferred.promise;
        };

        dmlService.userSettings = {};

        dmlService.getUserSettings = function () {
            var sRef = dmlService._settingRef()
                , deferred = $q.defer()
                ;
            sRef.once('value', function (dataSnapshot) {
                dmlService.userSettings = dataSnapshot.val();
                deferred.resolve(0);
            });
            return deferred.promise;
        };

        dmlService.getAllKeys = function () {
            var deferred = $q.defer()
                ;
            deferred.resolve(dmlService.userSettings);
            return deferred.promise;
        };

        dmlService.setFile = function (file) {
            var fileRef = dmlService._fileRef()
                , deferred = $q.defer()
                , startAt, endAt
                ;

            file = (file || {});
            if (!(file.name)) file.name = "poza";
            startAt = file.name;
            endAt = file.name;

            fileRef.startAt(startAt).endAt(endAt).once('value', function (fileSnapshot) {
                var theFile = fileSnapshot.val()
                    , fileId
                    ;
                if (theFile) {
                    fileId = _.pairs(theFile)[0][0];
                    return dmlService._upd(fileRef, file, fileId, file.name).then(function (fileId) {
                        deferred.resolve(fileId);
                    }, function (error) {
                        deferred.reject('dmlservice/setFile: ' + error);
                    });
                } else {
                    return dmlService._add(fileRef, file, file.name).then(function (fileId) {
                        deferred.resolve(fileId);
                    }, function (error) {
                        deferred.reject('dmlservice/setFile: ' + error);
                    });
                }
            });

            return deferred.promise;
        };

        dmlService.getFiles = function () {
            var fileRef = dmlService._fileRef()
                , deferred = $q.defer()
                ;
            fileRef.once('value', function (fileSnapshot) {
                var files = _.pairs(fileSnapshot.val())
                    , filesRet = []
                    ;
                _.each(files, function (file) {
                    if (file[0] != 'counter') {
                        file[1].id = file[0];
                        filesRet.push(file[1]);
                    }
                });
                deferred.resolve(filesRet);
            });
            return deferred.promise;
        };

        dmlService.getInventory = function () {
            var inventoryRef = dmlService._inventoryRef()
                , deferred = $q.defer()
                ;
            inventoryRef.once('value', function (inventorySnapshot) {
                var items = _.pairs(inventorySnapshot.val())
                    , itemsRet = []
                    ;
                _.each(items, function (item) {
                    if (item[0] != 'counter') {
                        item[1].id = item[0];
                        itemsRet.push(item[1]);
                    }
                });
                deferred.resolve(itemsRet);
            });
            return deferred.promise;
        };

        dmlService.setInventory = function (inventory) {
            var inventoryRef = dmlService._inventoryRef()
                , deferred = $q.defer()
                , startAt, endAt
                ;
            inventory = (inventory || {});
            if (!(inventory.name)) inventory.name = "obiect de inventar";
            startAt = inventory.name;
            endAt = inventory.name;

            inventoryRef.startAt(startAt).endAt(endAt).once('value', function (inventorySnapshot) {
                var theInventory = inventorySnapshot.val()
                    , inventoryId
                    ;
                if (theInventory) {
                    inventoryId = _.pairs(theInventory)[0][0];
                    return dmlService._upd(inventoryRef, inventory, inventoryId, inventory.name).then(function (inventoryId) {
                        deferred.resolve(inventoryId);
                    }, function (error) {
                        deferred.reject('dmlservice/setInventory: ' + error);
                    });
                } else {
                    return dmlService._add(inventoryRef, inventory, inventory.name).then(function (inventoryId) {
                        deferred.resolve(inventoryId);
                    }, function (error) {
                        deferred.reject('dmlservice/setInventory: ' + error);
                    });
                }
            });
            return deferred.promise;
        };
        return dmlService;
    }]);