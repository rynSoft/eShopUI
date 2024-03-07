import { Fragment } from "react";
import { toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Avatar from "@components/avatar";
import { Check, XOctagon } from "react-feather";
function toastData(message,controlType){
    const ToastContent = ({ alertMessage, controller }) => (
        <Fragment>
          {controller}
          <div className={"toastify-header"}>
            <div className="title-wrapper ">
              <Avatar
                size="sm"
                color={controller == true ? "success" : "danger"}
                icon={
                  controller == true ? <Check size={16} /> : <XOctagon size={16} />
                }
              />
              <h6 className="toast-title fw-bold" style={{ color: "white" }}>
                {alertMessage}
              </h6>
            </div>
          </div>
        </Fragment>
      );
      toast(<ToastContent alertMessage={message} controller={controlType} />, {
        icon: false,
        transition: Slide,
        hideProgressBar: true,
        autoClose: 5000,
        style:controlType == true ? { backgroundColor: "green" }: { backgroundColor: "red", color: "white !important" },
      });
}
export default toastData;