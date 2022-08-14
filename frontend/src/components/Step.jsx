import React, { useState } from "react";

//{ detail, review, download }
const Step = ({ detail, review, download }) => {
  //   const detail = true;
  //   const review = false;
  //   const download = true;

  const step1 = review ? "active step" : "completed step"; //: "active step"

  return (
    <>
      <div className="ui three top attached steps">
        <div className={detail ? `completed step` : `active step`}>
          <i class="newspaper outline icon"></i>
          <div className="content">
            <div className="title">Details</div>
            <div className="description">Enter details</div>
          </div>
        </div>
        <div
          className={
            detail
              ? review
                ? "completed step"
                : "active step"
              : "disabled step"
          }
        >
          <i class="binoculars icon"></i>
          <div className="content">
            <div className="title">Review</div>
            <div className="description">Review details</div>
          </div>
        </div>
        <div
          className={
            review
              ? download
                ? "completed step"
                : "active step"
              : "disabled step"
          }
        >
          <i class="certificate icon"></i>
          <div className="content">
            <div className="title">Download</div>
            <div className="description">Download certificate</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step;
