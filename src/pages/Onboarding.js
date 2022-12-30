import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import Footer from "../components/common/Footer";
// import Sidebar from "../components/common/Sidebar";
import Button from "../components/formComponents/Button";
import module from "./Auth/styling/authpages.module.scss";
import { onboardingUser } from "../actions/AuthAction";
import DropSelector from "../components/formComponents/DropSelector";
const OnboardingPage = () => {
  // let token = localStorage.getItem("fr_token");
  // let token_onboarding = localStorage.getItem("fr_onboarding");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState("");
  // const [resetPass, setResetPass] = useState(true);
  const select_one = [
    {
      value: "",
      label: "Select",
    },
    {
      value: "organic-marketing",
      label: "Organic marketing",
    },
    {
      value: "marketing-automation",
      label: "Marketing automation",
    },
    {
      value: "business",
      label: "Business",
    },
  ];
  const select_two = [
    {
      value: "",
      label: "Select",
    },
    {
      value: "owner",
      label: "Owner",
    },
    {
      value: "marketer",
      label: "Marketer",
    },
    {
      value: "sales",
      label: "Sales",
    },
    {
      value: "community-builder",
      label: "Community builder",
    },
    {
      value: "product-manager",
      label: "Product manager",
    },
  ];
  const select_three = [
    {
      value: "",
      label: "Select",
    },
    {
      value: "fb-automation",
      label: "FB automation",
    },
    {
      value: "organic-marketing",
      label: "Organic marketing",
    },
    {
      value: "just-exploring",
      label: "Just exploring",
    },
  ];

  const [selectedValueOne, setSelectedValueOne] = useState("null");
  const [selectedValueTwo, setSelectedValueTwo] = useState("null");
  const [selectedValueThree, setSelectedValueThree] = useState("null");

  useEffect(() => {}, [selectedValueOne, selectedValueTwo, selectedValueThree]);

  const handelerSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    dispatch(
      onboardingUser({
        token: localStorage.getItem("fr_token"),
        question_one: selectedValueOne,
        question_two: selectedValueTwo,
        question_three: selectedValueThree,
        // token: token,
      })
    )
      .unwrap()
      .then((response) => {
        //navigate('/success');
        //setSuccess(true);
        localStorage.setItem("fr_onboarding", 1);
        navigate("/");
      })
      .catch((error) => {
        setSuccess(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handelerSkipSubmit = (e) => {
    e.preventDefault();
    //setLoader(true);

    dispatch(
      onboardingUser({
        token: localStorage.getItem("fr_token"),
        question_one: "null",
        question_two: "null",
        question_three: "null",
        // token: token,
      })
    )
      .unwrap()
      .then((response) => {
        //navigate('/success');
        //setSuccess(true);
        localStorage.setItem("fr_onboarding", 1);
        navigate("/");
      })
      .catch((error) => {
        setSuccess(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <span className="skip-wraper" onClick={handelerSkipSubmit}>
        Skip
      </span>
      <div className="page-wrapers">
        <div className={module["auth-heading-info"]}>
          <h3 className="text-center onboarding-heading">
            Tell us about yourself
          </h3>
          <p className="text-center onboarding-para">
            We’ll cusmotize your friender exprience besed on your choice.
          </p>
        </div>
        <form onSubmit={handelerSubmit}>
          <div className="selectbox-wraper">
            <p>What kind of work did you do?</p>
            <DropSelector
              selects={select_one}
              value={selectedValueOne}
              handleChange={(e) => {
                setSelectedValueOne(e.target.value);
              }}
              width={"100%"}
            />
          </div>
          <div className="selectbox-wraper">
            <p>What is your role?</p>
            <DropSelector
              selects={select_two}
              handleChange={(e) => {
                setSelectedValueTwo(e.target.value);
              }}
              width={"100%"}
            />
          </div>
          <div className="selectbox-wraper">
            <p>What are you planing to do in Friender?</p>
            <DropSelector
              selects={select_three}
              handleChange={(e) => {
                setSelectedValueThree(e.target.value);
              }}
              width={"100%"}
            />
          </div>
          {success && (
            <span className="error-mesage existing-email text-center margin-up-down">
              {success}
            </span>
          )}
          <div className="reset-password buttons-submit">
            {selectedValueOne === "null" &&
            selectedValueTwo === "null" &&
            selectedValueThree === "null" ? (
              <Button
                extraClass="btn-primary"
                btnText="Next"
                loaderValue={loader}
                disable={true}
              />
            ) : (
              <Button
                extraClass="btn-primary"
                btnText="Next"
                loaderValue={loader}
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default OnboardingPage;
