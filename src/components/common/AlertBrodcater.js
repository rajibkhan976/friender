import Alertbox from "./Toast";

export const fr_channel = new BroadcastChannel('friender_channel');
export const alertBrodcater=()=>{
    fr_channel.onmessage = (e) => {
        const data=e.data;
        if (data.cmd === 'alert') {
            Alertbox(
                `${data.message}`,
                `${data.type}`,
                data.time,
                `${data.position}`
              );
            }
    }
}
