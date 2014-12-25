function isEmpty (s) {
   return /^\s*$/.test (s == null ? "" : s);
}

function isNonEmpty (s) {
   return !isEmpty (s);
}

function eql (s0, s1) {
   return s0 == s1;
}

function isEmailAddress (s) {
   return /^\s*[^\s@]+@[^\s@]+\s*$/.test (s == null ? "" : s);
}

function setMessage (id, msg) {
   document.getElementById (id).childNodes[0].data = msg;
}

function validateField (fld_id, okTest, errMsg) {
   fld = document.getElementById (fld_id);
   if (!okTest (fld.value)) {
      setMessage (fld_id + 'Msg', errMsg);
      fld.focus ();
      return false;
   }
   setMessage (fld_id + 'Msg', '');
   return true;
}

function validate2Fields (fld_id0, fld_id1, okTest, errMsg) {
   fld0 = document.getElementById (fld_id0);
   fld1 = document.getElementById (fld_id1);
   if (!okTest (fld0.value, fld1.value)) {
      setMessage (fld_id0 + 'Msg', errMsg);
      fld0.focus ();
      return false;
   }
   return true;
}

