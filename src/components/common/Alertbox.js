
export const success = "#42f462";

export const failed = "#ef533e";
export const info = "#37befc";
const x = document.getElementById("showmsg");
export function showMessage(msg,type, duration = 30000) {
  if (!x) return;
  var alertMsg=document.createElement('div');



  alertMsg.setAttribute('class','showmsg-child show')

   
  alertMsg.innerHTML = `<div class='alert-inner'>
  <div>icon</div>  
  <div class='alert-inner-sec'>
  <div class='msg-header'>Wrong</div>
  <div class='msg'>${msg}</div>
  </div>
  <button class="ptagat" onclick="${()=>{alert("hiiii")}}" >click!!</button>
  </div>`;

  // <script type="text/javascript">
  //     ${(function(document){
  //     console.log("jkhdbgfkjgfdkjuikyh", document.querySelector('div[class="ptagat"]'))
  //     document.getElementById("showmsg").querySelector('div[class="ptagat"]').onclick = (e)=>{
  //       alert("hii")
  //     };
  //   })(document)}
  //   </script>
  // alertMsg.style.backgroundColor = color || success;
  x.appendChild(alertMsg);
  // document.getElementsByClassName("ptagat").onclick=function(event){
  //   if(event.target.id ===){

  //   }
  // }
  // alertMsg.className = "show";
  setTimeout(function() {
    alertMsg.className = alertMsg.className.replace("showmsg-child show", "showmsg-child hide");
  }, duration);
}
x && x.addEventListener("click",()=>x.className = "")


// export function showHttpError(err) {
//   let message = err.message || err;
//   if (err && err.response) {
//     if (err.response.data) {
//       message = err.response.data.message;
//     } else {
//       message = err.response.message;
//     }
//   }
//   showMessage(message, failed, 3000);
// }

export default showMessage;

