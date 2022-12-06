import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Lottie from "react-lottie-player";
import { Link } from "react-router-dom";

import rocketAnimation from "./rocket-animation.json";

import LogoL from "../../assets/images/logo.png";
import styles from "./styling/extension.module.scss";

function InstallSuccess() {
  const logState = useSelector((state) => state.auth.isLoggedIn);
  const [rocketLift, setRocketLift] = useState(false);

  useEffect(() => {
    setRocketOff();
  }, []);

  const setRocketOff = () => {
    // const rocket = document.querySelector('.rocket');

    setTimeout(() => {
      console.log("rocket  is lifting off");

      setRocketLift(true);

      console.log("class addae****d", rocketLift);
      // rocket.classList.add('lift-off');
    }, 8000);
  };

  window.addEventListener("load", () => {
    setRocketOff();
  });

  return (
    <>
    <header className={styles.header}>
      <Link to={{ pathname: "https://tier5.in/" }} target="_blank">
        <img src={LogoL} alt="Logo" />
      </Link>
      {!logState ? (
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
      ) : (
        <Link to="/" className={styles.btn}>
          Dashboard
        </Link>
      )}
    </header>
    <section className={styles["content-success"]}>
      <div className={styles["sky-content"]}>
        <span className={styles['cloud-1']}>
          <svg
            width={59}
            height={33}
            viewBox="0 0 59 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M49.6788 14.4343C47.9406 14.4343 46.3145 14.9095 44.9218 15.7344C44.5892 10.9083 40.5558 7.09566 35.6253 7.09566C34.4235 7.09566 33.2761 7.32475 32.2212 7.73723C30.8782 3.26245 26.7152 0 21.7853 0C15.7695 0 10.8928 4.85667 10.8928 10.8478C10.8928 11.0013 10.8979 11.1531 10.9043 11.3047L10.8928 11.3044C4.87684 11.3044 0 16.161 0 22.1522C0 28.1433 4.87684 33 10.8928 33C11.2683 33 11.6394 32.981 12.0052 32.944H48.6628C48.9965 32.9804 49.3352 33 49.6788 33C54.8268 33 59 28.8441 59 23.7171C59 18.5902 54.8268 14.4343 49.6788 14.4343Z"
              fill="white"
            />
          </svg>
        </span>
        <span className={styles['cloud-2']}>
          <svg
            width={154}
            height={87}
            viewBox="0 0 154 87"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M129.513 37.6388C124.999 37.6388 120.777 38.8779 117.16 41.029C116.296 28.4445 105.822 18.5027 93.0182 18.5027C89.8973 18.5027 86.9176 19.1001 84.1782 20.1756C80.6906 8.50721 69.8799 4.57764e-05 57.0775 4.57764e-05C41.4553 4.57764e-05 28.791 12.6643 28.791 28.2868C28.791 28.687 28.8044 29.083 28.8209 29.4781L28.791 29.4773C13.1684 29.4773 0.503906 42.1415 0.503906 57.764C0.503906 73.3865 13.1684 86.0508 28.791 86.0508C29.7663 86.0508 30.7299 86.0013 31.6799 85.9048H126.875C127.741 85.9996 128.621 86.0508 129.513 86.0508C142.882 86.0508 153.719 75.2138 153.719 61.8448C153.719 48.4758 142.882 37.6388 129.513 37.6388Z"
              fill="white"
            />
          </svg>
        </span>
        <span className={styles['cloud-3']}>
          <svg
            width={71}
            height={40}
            viewBox="0 0 71 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6784 17.6051C13.7358 17.6051 15.6612 18.1706 17.3107 19.1505C17.7039 13.4136 22.4798 8.88064 28.3169 8.88064C29.7399 8.88064 31.0983 9.15245 32.3472 9.64325C33.9373 4.32418 38.8663 0.445621 44.7031 0.445621C51.8251 0.445621 57.5993 6.21858 57.5993 13.3414C57.5993 13.5227 57.593 13.7039 57.5852 13.8843H57.5993C64.7217 13.8843 70.4955 19.6581 70.4955 26.7801C70.4955 33.9029 64.7217 39.6768 57.5993 39.6768C57.1549 39.6768 56.7151 39.6541 56.2822 39.6105H12.8815C12.4863 39.6533 12.0851 39.6768 11.6784 39.6768C5.58308 39.6768 0.642334 34.7361 0.642334 28.6409C0.642334 22.5458 5.58308 17.6051 11.6784 17.6051Z"
              fill="white"
            />
          </svg>
        </span>
        <span className={styles['cloud-4']}>
          <svg
            width={111}
            height={50}
            viewBox="0 0 111 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M96.9412 21.6422C94.3505 21.6422 91.9258 22.3537 89.8502 23.5879C89.3544 16.3643 83.3424 10.6576 75.9921 10.6576C74.4048 10.6576 72.8854 10.9404 71.4642 11.432C69.4154 4.81083 63.2456 0.000148773 55.9516 0.000148773C55.4029 0.000148773 54.8643 0.0362282 54.3308 0.0890846C47.5175 0.518639 41.8418 5.13215 39.8719 11.4026C38.444 10.9068 36.9179 10.6215 35.3213 10.6215C27.972 10.6215 21.9599 16.3282 21.4641 23.5518C19.3876 22.3168 16.9638 21.6053 14.3731 21.6053C6.69901 21.6053 0.478027 27.8263 0.478027 35.4996C0.478027 43.1736 6.69901 49.3946 14.3731 49.3946C14.8848 49.3946 15.3899 49.3644 15.8874 49.3107H37.2275C37.8508 49.3837 38.4826 49.4307 39.1261 49.4307C39.6857 49.4307 40.2385 49.4022 40.7839 49.3476H71.2536C71.5649 49.3652 71.8728 49.3946 72.1882 49.3946C72.5037 49.3946 72.8108 49.3652 73.122 49.3476H95.426C95.9244 49.4013 96.4295 49.4307 96.9412 49.4307C104.614 49.4307 110.835 43.2105 110.835 35.5365C110.835 27.8624 104.614 21.6422 96.9412 21.6422Z"
              fill="white"
            />
          </svg>
        </span>
        <span className={styles['cloud-5']}>
          <svg
            width={129}
            height={72}
            viewBox="0 0 129 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.0179 31.4118C24.7765 31.4118 28.2926 32.4437 31.3045 34.2349C32.0227 23.757 40.7446 15.4789 51.4054 15.4789C54.0046 15.4789 56.4854 15.9764 58.7657 16.8716C61.6702 7.15628 70.6716 0.0720062 81.3316 0.0720062C94.339 0.0720062 104.884 10.617 104.884 23.6253C104.884 23.9575 104.872 24.2881 104.859 24.617L104.884 24.6161C117.891 24.6161 128.436 35.162 128.436 48.1694C128.436 61.1768 117.891 71.7227 104.884 71.7227C104.072 71.7227 103.269 71.6807 102.479 71.6001H23.2152C22.4928 71.679 21.7604 71.7227 21.0179 71.7227C9.88725 71.7227 0.863281 62.6987 0.863281 51.5672C0.863281 40.4357 9.88725 31.4118 21.0179 31.4118Z"
              fill="white"
            />
          </svg>
        </span>
        <span className={styles['cloud-6']}>
          <svg
            width={62}
            height={35}
            viewBox="0 0 62 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M52.2049 15.3089C50.3783 15.3089 48.6695 15.813 47.2057 16.6879C46.8567 11.5697 42.6178 7.52596 37.4367 7.52596C36.1736 7.52596 34.9679 7.76899 33.8597 8.20627C32.4481 3.46054 28.0735 0 22.8928 0C16.5712 0 11.4464 5.15105 11.4464 11.5053C11.4464 11.6676 11.4521 11.8291 11.4586 11.9897L11.4464 11.9893C5.12486 11.9893 0 17.1408 0 23.4947C0 29.8485 5.12486 35 11.4464 35C11.8411 35 12.2313 34.9795 12.6154 34.9402H51.1371C51.4881 34.9787 51.8441 35 52.2049 35C57.6144 35 62 30.592 62 25.1544C62 19.7169 57.6144 15.3089 52.2049 15.3089Z"
              fill="white"
            />
          </svg>
        </span>

        <figure
          className={`
            ${styles['rocket']} ${rocketLift ? styles['lift-off'] : ''}
          `}
        >
          <Lottie
            loop
            animationData={rocketAnimation}
            play
            background="transparent"
            style={{ width: "310px", height: "320px" }}
          />
          {/* <iframe  title="rocket" src="https://embed.lottiefiles.com/animation/81045" />  */}
          {/* <lottiePlayer 
        src="https://lottie.host/0df6fc04-6994-494a-892d-d0648359303b/yIhBBASq64.json" 
        background="transparent" speed={1} style={{width: '310px', height: '320px'}} loop autoPlay /> */}
        </figure>
      </div>
      <div className={styles["land-content"]}>
        <h1>Congratulations! Friender Successfully Installed.</h1>
        <p>
          You're seeing this page because you have successfully installed
          Fiender extension in your browser.
        </p>
      </div>
    </section>
    </>
  );
}

export default InstallSuccess;
