
// Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
export const ThrottleFx  =  (func, delay)=> {
	let inThrottle;
return function(){
	if(!inThrottle){
		func();
		inThrottle=true;

		//after a delay  iam opening the throttle
		setTimeout(() => (inThrottle = false), delay);
	}
}
}








