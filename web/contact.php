<?php

require_once 'scripts/firebaseLib.php';


if(isset($_POST['email'])) {
 
     
 
    // EDIT THE 2 LINES BELOW AS REQUIRED
 
    $email_to = "info@caffeina.mobi";
 
    $email_subject = "A new message from my photography site!";
 

    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
     }
 
     
     // validation expected data exists
     if(!isset($_POST['first_name']) ||
         !isset($_POST['last_name']) ||
         !isset($_POST['email']) ||
         !isset($_POST['telephone']) ||
         !isset($_POST['comments'])) {
         died('We are sorry, but there appears to be a problem with the form you submitted.');
     }
 
     
 
     $first_name = $_POST['first_name']; // required
     $last_name = $_POST['last_name']; // required
     $email_from = $_POST['email']; // required
     $telephone = $_POST['telephone']; // not required
     $comments = $_POST['comments']; // required
 
     
 
     $error_message = "";
     $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email_from)) {
     $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
   }
 
    $string_exp = "/^[A-Za-z .'-]+$/";
 
  if(!preg_match($string_exp,$first_name)) {
     $error_message .= 'The First Name you entered does not appear to be valid.<br />';
   }
 
  if(!preg_match($string_exp,$last_name)) {
     $error_message .= 'The Last Name you entered does not appear to be valid.<br />';
   }
 
  if(strlen($comments) < 2) {
     $error_message .= 'The Comments you entered do not appear to be valid.<br />';
   }
 
  if(strlen($error_message) > 0) {
     died($error_message);
   }
 
    $email_message = "A visitor wrote to you the following:\n\n";

 
    function clean_string($string) {
 
      $bad = array("content-type","bcc:","to:","cc:","href");
       return str_replace($bad,"",$string);
     }
 
     
 
     $email_message .= "First Name: ".clean_string($first_name)."\n";
     $email_message .= "Last Name: ".clean_string($last_name)."\n";
     $email_message .= "Email: ".clean_string($email_from)."\n";
     $email_message .= "Telephone: ".clean_string($telephone)."\n";
     $email_message .= "Comments: ".clean_string($comments)."\n";
 
     
 

//pus pe userul daniel
    $fb = new Firebase('https://caffeina.firebaseio.com/Y2hpbmRlYS5kYW5pZWxAZ21haWwuY29t','If7Vp2KfhXZl5kgtCaEcgrdET0vX6Ap4XQE2OgQK');
//    $response=$fb->get('/noroc');

    class objToAdd
        {
            public $createdAt;
            public updatedAt;
            public version=1;
            public isDeleted=false;

        }


    $fb->set(''


//                        return dmlService._add(jobRef, job, job.type.name);
//return dmlService._add(taskRef, newTask, newTask.date).then(function (taskId) {
//                                  jobRef.child(jobId).update({tasks: taskId});
//            return firebaseRef('/users/' + btoa(user.user.email) + '/jobs/');
//            return firebaseRef('/users/' + btoa(user.user.email) + '/tasks/');



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



// create email headers
 
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
 
@mail($email_to, $email_subject, $email_message, $headers);  





?>
 
 
 
<!-- include your own success html here -->
 
 
 
Thank you for contacting us. We will be in touch with you very soon.
 
 
 
<?php
 
}
 
?>