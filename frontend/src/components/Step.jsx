import React from "react";

const Step = ({ detail, review, download }) => {
  return (
    <>
      <div className="ui three top attached steps">
        <div className={detail ? `completed step` : `active step`}>
          <i className="newspaper outline icon"></i>
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
          <i className="binoculars icon"></i>
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
          <i className="certificate icon"></i>
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
