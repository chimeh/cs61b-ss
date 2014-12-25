
<html>
<head>
<link rel="stylesheet" type="text/css" href="../styles/admin-style.css">

<script type="text/javascript" src="../admin/admin-funcs.js"></script>
<script type="text/javascript">
<!--
   function setLoginStatus (isError, msg) {
      if (isError) {
          setMessage ('loginErrorStatus', msg);
          setMessage ('loginStatus', "");
      } else {
          setMessage ('loginStatus', msg);
          setMessage ('loginErrorStatus', "");
      }
   }

   function validateLogin () {
      login = document.getElementById ('login');
      passwd = document.getElementById ('password');
      if (isEmpty (login.value)) {
          setLoginStatus (true, "Must supply login.");
	  login.focus ();
      } else if (isEmpty (passwd.value)) {
          setLoginStatus (true, "Must supply non-empty password");
	  passwd.focus ();
      } else
          return true;
      return false;
   }

   function isValidSID (s) {
      return /^\s*(\d{6}|\d{8}|0)\s*$/.test (s);
   }

   function isProperPassword (s) {
      return /^[!#-~]{6,}$/.test (s);
   }

   function validateRegister () {
      return validateField ('lastname', isNonEmpty, "Please supply your last (family) name")
          && validateField ('SID', isNonEmpty, 
	                    "Please supply your SID (or 0 if none)")
	  && validateField ('SID', isValidSID, "SID has the wrong form")
          && validateField ('email', isNonEmpty, 
	                    "Please supply an e-mail address")
          && validateField ('email', isEmailAddress, 
	                    "E-mail address does not have the right form");
   }

   function validateRepositoryPasswd () {
      return 
          || (validate2Fields ('repositoryPassword', 'repositoryPassword2', eql,
	                       'Passwords do not match')
              && validateField ('repositoryPassword', isProperPassword,
	                        "Password may contain only letters, digits, underscores, and punctuation and must have at least 6 characters"));
   }

-->
</script>
<title>
CS61B Account Administration
</title>
</head>
<body>

<h1>CS61B Account Administration</h1>

<h2><a name="loginout" id="loginout"> Login </a></h2>

<table width="100%">
  <tr>
    <td width="50%" colspan="3"> 
       <form name="LoginForm" id="LoginForm" 
             onsubmit="return validateLogin ();"
	     action="student-admin.cgi" method="post">
	  <input type="hidden" name="sessionid" value="bc95da3c368ef0df05dfc850656fddf3"/>
	  <table>
	     <tr> <td colspan="3"> 
	             <span id="loginStatus"> You are not logged in </span> 
	             <span class="err" id="loginErrorStatus"> 
		         
                     </span> 
		  </td> </tr>
		  <td> <input type="text" name="login" id="login" 
                              size="10" value=""/> </td>
		  <td> <input type="password" name="password" id="password"
                              size="15"/> </td>
		  <td> <input type="submit" name="Submit" value="Login"/> </td>              </tr>
	     <tr>
		<td> Login Name </td>
		<td> Password </td>
	     </tr>
	  </table>
       </form>
    </td>
    <td width="50%"> 
      <form name="LogoutForm" id="LogoutForm" 
	    action="student-admin.cgi" method="post">
	 <p align="RIGHT"> 
	   <input type="hidden" name="sessionid" value="bc95da3c368ef0df05dfc850656fddf3"/>
	   <input type="submit" name="Submit" value="Logoff"/>
	 </p>
      </form>
    </td>
  </tr>
</table>

<p align="center">
<a href="../index.html"> Class Home Page </a>

<h2><a name="glookup" id="glookup">Grades</a></h2>

Login first to access your current scores.  

<h2><a name="account" id="account">Your Individual Account</a></h2>

<form name="RegisterForm" id="RegisterForm" 
      onsubmit="return validateRegister ();"
      action="student-admin.cgi" method="post">
<input type="hidden" name="sessionid" value="bc95da3c368ef0df05dfc850656fddf3"/>
<p> 
Use the boxes below for registering your individual login, after first logging
in above.
You may also use this part of the form to
modify information in an existing registration.
Alternatively, you can use the "register" and "re-register" commands in a 
Unix shell to do this.

<p>
You cannot completely delete 
a registration for a given login once you have made it.  Please contact
the CS61B staff if you wish to do so.

<p>
<!--Supply a dummy codename, since we don't need it this year.-->
<input type="hidden" name="codename" value="NONE"/>
<table class="boxed" align="center">

    <tr>
        <td>  </td>
    </tr>

    <tr> <td> <hr> </td> </tr>

    <tr> 
	<td> Your last name (family name): </td>
    </tr>
    <tr>
	<td> <input type="text" name="lastname" id="lastname"
                    value="" size="25"/> </td>
	<td class="err" id="lastnameMsg">  </td>
    </tr>
    <tr> <td> <hr> </td> </tr>
    <tr>
	<td> Your first (given) and middle name(s): </td>
    </tr>
    <tr>
	<td> <input type="text" name="firstnames" id="firstnames"
	            value="" size="25"/> </td>
	<td class="err" id="firstnamesMsg">  </td>
    </tr>
    <tr> <td> <hr> </td> </tr>
    <tr>
	<td> Your student ID (or 0 if none): </td>
    </tr>
    <tr>
	<td> <input type="text" name="SID" id="SID"
                    value="" size="15"/> </td>
	<td class="err" id="SIDMsg">  </td>
    </tr> 
    <tr> <td> <hr> </td> </tr>
    <tr>
	<td> Your Email address: </td>
    </tr>
    <tr>
	<td> <input type="text" name="email" id="email"
                    value="" size="25"/> </td>
	<td class="err" id="emailMsg">  </td>
    </tr> 
    <tr> <td> <hr> </td> </tr>

    <tr> <td> &nbsp; </td> </tr>

    <tr>
	<td align="center" colspan="2"> 
            <input type="submit" name="Submit" value="Register" disabled="True"/>
	       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	    <input type="reset" name="reset"/> 
	</td>
	</td>
    </tr>
</table>
</form>

<p>
<form action="student-admin.cgi" method="post">
   <p align="center" > 
   <input type="hidden" name="sessionid" value="bc95da3c368ef0df05dfc850656fddf3"/>
   <input type="submit" name="Submit" value="Logoff"/></p>
</form>

<p align="center">
<a href="../index.html"> Class Home Page </a>

</body>
</html>

