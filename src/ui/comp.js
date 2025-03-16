import styled from 'styled-components';


export const ButtonWrapper = styled.div`
  .container {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row; /* Changed from column to row */
  justify-content: space-between; /* Distributes buttons to the left and right */
  align-items: center;
  padding: 0 20px; /* Adds some spacing on the sides */
}
  .button:not(:last-child) {
  margin-bottom: 0; /* Remove vertical spacing */
  margin-right: 32px; /* Optional spacing between buttons */
}

  .type--A {
    --line_color: #555555;
    --back_color: #ffecf6;
  }
  .type--B {
    --line_color: #1b1919;
    --back_color: #e9ecff;
  }
  .type--C {
    --line_color: #00135c;
    --back_color: #defffa;
  }

  .button {
    position: relative;
    z-index: 0;
    width: 240px;
    height: 56px;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    color: var(--line_color);
    letter-spacing: 2px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    animation: popUp 2s ease-in-out;
  }

  .button__text {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .button::before,
  .button::after,
  .button__text::before,
  .button__text::after {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: var(--line_color);
    transition: all 0.5s ease;
  }

  .button::before {
    top: 0;
    left: 54px;
    width: calc(100% - 56px * 2 - 16px);
  }

  .button::after {
    top: 0;
    right: 54px;
    width: 8px;
  }

  .button__text::before {
    bottom: 0;
    right: 54px;
    width: calc(100% - 56px * 2 - 16px);
  }

  .button__text::after {
    bottom: 0;
    left: 54px;
    width: 8px;
  }

  .button__line {
    position: absolute;
    top: 0;
    width: 56px;
    height: 100%;
    overflow: hidden;
  }

  .button__line::before {
    content: "";
    position: absolute;
    top: 0;
    width: 150%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 300px;
    border: solid 3px var(--line_color);
  }

  .button__line:nth-child(1),
  .button__line:nth-child(1)::before {
    left: 0;
  }

  .button__line:nth-child(2),
  .button__line:nth-child(2)::before {
    right: 0;
  }

  .button:hover {
    letter-spacing: 6px;
  }

  .button:hover::before,
  .button:hover .button__text::before {
    width: 8px;
  }

  .button:hover::after,
  .button:hover .button__text::after {
    width: calc(100% - 56px * 2 - 16px);
  }

  .button__drow1,
  .button__drow2 {
    position: absolute;
    z-index: -1;
    border-radius: 16px;
    transform-origin: 16px 16px;
  }

  .button__drow1 {
    top: -16px;
    left: 40px;
    width: 32px;
    height: 0;
    transform: rotate(30deg);
  }

  .button__drow2 {
    top: 44px;
    left: 77px;
    width: 32px;
    height: 0;
    transform: rotate(-127deg);
  }

  .button__drow1::before,
  .button__drow1::after,
  .button__drow2::before,
  .button__drow2::after {
    content: "";
    position: absolute;
  }

  .button__drow1::before {
    bottom: 0;
    left: 0;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-60deg);
  }

  .button__drow1::after {
    top: -10px;
    left: 45px;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(69deg);
  }

  .button__drow2::before {
    bottom: 0;
    left: 0;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-146deg);
  }

  .button__drow2::after {
    bottom: 26px;
    left: -40px;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-262deg);
  }

  .button__drow1,
  .button__drow1::before,
  .button__drow1::after,
  .button__drow2,
  .button__drow2::before,
  .button__drow2::after {
    background: var(--back_color);
  }

  .button:hover .button__drow1 {
    animation: drow1 ease-in 0.06s;
    animation-fill-mode: forwards;
  }

  .button:hover .button__drow1::before {
    animation: drow2 linear 0.08s 0.06s;
    animation-fill-mode: forwards;
  }

  .button:hover .button__drow1::after {
    animation: drow3 linear 0.03s 0.14s;
    animation-fill-mode: forwards;
  }

  .button:hover .button__drow2 {
    animation: drow4 linear 0.06s 0.2s;
    animation-fill-mode: forwards;
  }

  .button:hover .button__drow2::before {
    animation: drow3 linear 0.03s 0.26s;
    animation-fill-mode: forwards;
  }

  .button:hover .button__drow2::after {
    animation: drow5 linear 0.06s 0.32s;
    animation-fill-mode: forwards;
  }

  @keyframes drow1 {
    0% {
      height: 0;
    }
    100% {
      height: 100px;
    }
  }

  @keyframes drow2 {
    0% {
      width: 0;
      opacity: 0;
    }
    10% {
      opacity: 0;
    }
    11% {
      opacity: 1;
    }
    100% {
      width: 120px;
    }
  }

  @keyframes drow3 {
    0% {
      width: 0;
    }
    100% {
      width: 80px;
    }
  }

  @keyframes drow4 {
    0% {
      height: 0;
    }
    100% {
      height: 120px;
    }
  }

  @keyframes drow5 {
    0% {
      width: 0;
    }
    100% {
      width: 124px;
    }
  }
`;

export const Button2Wrapper = styled.div`
.animated-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 36px;
  border: 4px solid;
  border-color: transparent;
  font-size: 16px;
  background-color: ;
  border-radius: 100px;
  font-weight: 600;
  color: #1f387e;
  box-shadow: 0 0 0 2px #ffffff;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button svg {
  position: absolute;
  width: 24px;
  fill: #1f387e;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .arr-1 {
  right: 16px;
}

.animated-button .arr-2 {
  left: -25%;
}

.animated-button .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #c5e5e4;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .text {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button:hover {
  box-shadow: 0 0 0 12px transparent;
  color: #212121;
  border-radius: 12px;
}

.animated-button:hover .arr-1 {
  right: -25%;
}

.animated-button:hover .arr-2 {
  left: 16px;
}

.animated-button:hover .text {
  transform: translateX(12px);
}

.animated-button:hover svg {
  fill: #1f387e;
}

.animated-button:active {
  scale: 0.95;
  box-shadow: 0 0 0 4px greenyellow;
}

.animated-button:hover .circle {
  width: 220px;
  height: 220px;
  opacity: 1;
}`;

export const ButtonNavWrapper = styled.div`
.btn-shine {
  position: relative;
  top: -100%;
  left: 20%;
  transform: translate(-50%, -0%);
  padding: 12px 48px;
  color: #fff;
  background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
  background-position: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s infinite linear;
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  white-space: nowrap;
  font-family: "Poppins", sans-serif;
}
@-moz-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 180px;
  }
  100% {
    background-position: 180px;
  }
}
@-webkit-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 180px;
  }
  100% {
    background-position: 180px;
  }
}
@-o-keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 180px;
  }
  100% {
    background-position: 180px;
  }
}
@keyframes shine {
  0% {
    background-position: 0;
  }
  60% {
    background-position: 180px;
  }
  100% {
    background-position: 180px;
  }
}`;

export const HostCardWrapper = styled.div`
  .card {
    overflow: hidden;
    position: fixed; /* Fixed at the top */
    top: 0;
    left: 50%;
    transform: translateX(-50%); /* Center it */
    text-align: left;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 600px; /* Optional: Prevent it from being too wide */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(23, 185, 23, 0.04);
    background-color: lightgreen;
    z-index: 1000; /* Ensures it stays on top */
  }
  
  /* Adjust body padding to prevent content from hiding under it */
  body {
    padding-top: 80px; /* Adjust according to the card's height */
  }

  .dismiss {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: black;
    border: 2px solid #D1D5DB;
    font-size: 1rem;
    font-weight: 300;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    transition: .3s ease;
  }

  .dismiss:hover {
    background-color: #ee0d0d;
    border: 2px solid #ee0d0d;
    color: #fff;
  }

  .header {
    padding: 1.25rem 1rem 1rem 1rem;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #e2feee;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    animation: animate .6s linear alternate-reverse infinite;
    transition: .6s ease;
  }

  .image svg {
    color: #0afa2a;
    width: 2rem;
    height: 2rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #066e29;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #595b5f;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
  }

  .history {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #1aa06d;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .track {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    color: #242525;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #D1D5DB;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  @keyframes animate {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.09);
    }
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust spacing as needed */
`;

export const SearchWrapper = styled.div`
flex-grow: 1;
.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  max-width: 450px;
}

.input {
  height: 40px;
  line-height: 28px;
  padding: 0 1rem;
  width: 100%;
  padding-left: 2.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  outline: none;
  background-color: #D9E8D8;
  color: #0d0c22;
  box-shadow: 0 0 5px #C1D9BF, 0 0 0 10px #f5f5f5eb;
  transition: .3s ease;
}

.input::placeholder {
  color: #777;
}

.icon {
  position: absolute;
  left: 1rem;
  fill: #777;
  width: 1rem;
  height: 1rem;
}
  
  .dropdown {
    position: relative;
    top: 12px;
    width: 100%;
    background: grey;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 150px;
    overflow-y: auto;
  }

  .dropdown li {
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .dropdown li:hover {
    background:rgb(117, 106, 106);
  }`;

export const MapButtonWrapper = styled.div`
display: flex;
  align-items: center;

.faq-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffe53b;
  background-image: linear-gradient(147deg, #ffe53b 0%, #ff2525 74%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.151);
  position: relative;
}
.faq-button svg {
  height: 1.5em;
  fill: white;
}
.faq-button:hover svg {
  animation: jello-vertical 0.7s both;
}
@keyframes jello-vertical {
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(0.75, 1.25, 1);
  }
  40% {
    transform: scale3d(1.25, 0.75, 1);
  }
  50% {
    transform: scale3d(0.85, 1.15, 1);
  }
  65% {
    transform: scale3d(1.05, 0.95, 1);
  }
  75% {
    transform: scale3d(0.95, 1.05, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

.tooltip {
  position: absolute;
  top: -20px;
  opacity: 0;
  background-color: #ffe53b;
  background-image: linear-gradient(147deg, #ffe53b 0%, #ff2525 74%);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-duration: 0.2s;
  pointer-events: none;
  letter-spacing: 0.5px;
}

.tooltip::before {
  position: absolute;
  content: "";
  width: 10px;
  height: 10px;
  background-color: #ff2525;
  background-size: 1000%;
  background-position: center;
  transform: rotate(45deg);
  bottom: -15%;
  transition-duration: 0.3s;
}

.faq-button:hover .tooltip {
  top: -40px;
  opacity: 1;
  transition-duration: 0.3s;
}`;

export const LoaderWrapper = styled.div`
.hourglassBackground {
  position: relative;
  background-color: rgb(71, 60, 60);
  height: 130px;
  width: 130px;
  border-radius: 50%;
  margin: 30px auto;
}

.hourglassContainer {
  position: absolute;
  top: 30px;
  left: 40px;
  width: 50px;
  height: 70px;
  -webkit-animation: hourglassRotate 2s ease-in 0s infinite;
  animation: hourglassRotate 2s ease-in 0s infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.hourglassContainer div,
.hourglassContainer div:before,
.hourglassContainer div:after {
  transform-style: preserve-3d;
}

@-webkit-keyframes hourglassRotate {
  0% {
    transform: rotateX(0deg);
  }

  50% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(180deg);
  }
}

@keyframes hourglassRotate {
  0% {
    transform: rotateX(0deg);
  }

  50% {
    transform: rotateX(180deg);
  }

  100% {
    transform: rotateX(180deg);
  }
}

.hourglassCapTop {
  top: 0;
}

.hourglassCapTop:before {
  top: -25px;
}

.hourglassCapTop:after {
  top: -20px;
}

.hourglassCapBottom {
  bottom: 0;
}

.hourglassCapBottom:before {
  bottom: -25px;
}

.hourglassCapBottom:after {
  bottom: -20px;
}

.hourglassGlassTop {
  transform: rotateX(90deg);
  position: absolute;
  top: -16px;
  left: 3px;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  background-color: #999999;
}

.hourglassGlass {
  perspective: 100px;
  position: absolute;
  top: 32px;
  left: 20px;
  width: 10px;
  height: 6px;
  background-color: #999999;
  opacity: 0.5;
}

.hourglassGlass:before,
.hourglassGlass:after {
  content: '';
  display: block;
  position: absolute;
  background-color: #999999;
  left: -17px;
  width: 44px;
  height: 28px;
}

.hourglassGlass:before {
  top: -27px;
  border-radius: 0 0 25px 25px;
}

.hourglassGlass:after {
  bottom: -27px;
  border-radius: 25px 25px 0 0;
}

.hourglassCurves:before,
.hourglassCurves:after {
  content: '';
  display: block;
  position: absolute;
  top: 32px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #333;
  animation: hideCurves 2s ease-in 0s infinite;
}

.hourglassCurves:before {
  left: 15px;
}

.hourglassCurves:after {
  left: 29px;
}

@-webkit-keyframes hideCurves {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  30% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

@keyframes hideCurves {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  30% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.hourglassSandStream:before {
  content: '';
  display: block;
  position: absolute;
  left: 24px;
  width: 3px;
  background-color: white;
  -webkit-animation: sandStream1 2s ease-in 0s infinite;
  animation: sandStream1 2s ease-in 0s infinite;
}

.hourglassSandStream:after {
  content: '';
  display: block;
  position: absolute;
  top: 36px;
  left: 19px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fff;
  animation: sandStream2 2s ease-in 0s infinite;
}

@-webkit-keyframes sandStream1 {
  0% {
    height: 0;
    top: 35px;
  }

  50% {
    height: 0;
    top: 45px;
  }

  60% {
    height: 35px;
    top: 8px;
  }

  85% {
    height: 35px;
    top: 8px;
  }

  100% {
    height: 0;
    top: 8px;
  }
}

@keyframes sandStream1 {
  0% {
    height: 0;
    top: 35px;
  }

  50% {
    height: 0;
    top: 45px;
  }

  60% {
    height: 35px;
    top: 8px;
  }

  85% {
    height: 35px;
    top: 8px;
  }

  100% {
    height: 0;
    top: 8px;
  }
}

@-webkit-keyframes sandStream2 {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  51% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  91% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes sandStream2 {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  51% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  91% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.hourglassSand:before,
.hourglassSand:after {
  content: '';
  display: block;
  position: absolute;
  left: 6px;
  background-color: white;
  perspective: 500px;
}

.hourglassSand:before {
  top: 8px;
  width: 39px;
  border-radius: 3px 3px 30px 30px;
  animation: sandFillup 2s ease-in 0s infinite;
}

.hourglassSand:after {
  border-radius: 30px 30px 3px 3px;
  animation: sandDeplete 2s ease-in 0s infinite;
}

@-webkit-keyframes sandFillup {
  0% {
    opacity: 0;
    height: 0;
  }

  60% {
    opacity: 1;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 17px;
  }
}

@keyframes sandFillup {
  0% {
    opacity: 0;
    height: 0;
  }

  60% {
    opacity: 1;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 17px;
  }
}

@-webkit-keyframes sandDeplete {
  0% {
    opacity: 0;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  1% {
    opacity: 1;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  24% {
    opacity: 1;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  25% {
    opacity: 1;
    top: 41px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  50% {
    opacity: 1;
    top: 41px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  90% {
    opacity: 1;
    top: 41px;
    height: 0;
    width: 10px;
    left: 20px;
  }
}

@keyframes sandDeplete {
  0% {
    opacity: 0;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  1% {
    opacity: 1;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  24% {
    opacity: 1;
    top: 45px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  25% {
    opacity: 1;
    top: 41px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  50% {
    opacity: 1;
    top: 41px;
    height: 17px;
    width: 38px;
    left: 6px;
  }

  90% {
    opacity: 1;
    top: 41px;
    height: 0;
    width: 10px;
    left: 20px;
  }
}`;
