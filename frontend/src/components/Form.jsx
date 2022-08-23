import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Step from "./Step";
import Alert from "./Alert";

const Form = () => {
  const API = process.env.REACT_APP_API; //"http://localhost:5000";

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startGen, setStartGen] = useState(false);
  const [genComplete, setGenComplete] = useState(false);
  const [friendlyName, setFriendlyName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [Ou, setOU] = useState("");
  const [Organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [cert, setCert] = useState("");
  const [aName, setAName] = useState("");
  const [detail, setDetail] = useState(false);
  const [review, setreview] = useState(false);
  const [download, setDownload] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        friendlyName: friendlyName,
        AN: aName,
        CN: commonName,
        OU: Ou,
        O: Organization,
        C: city,
        S: province,
        L: country,
      };

      const data = await axios.post(`${API}/file`, formData);

      setCert(data.data);
      setDetail(true);
      setIsLoading(true);
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setIsError(true);
      //alert(err.message);
    }
  };

  const GenCert = async () => {
    try {
      setStartGen(true);
      const cert = await axios.get(`${API}/cert`);
      setStartGen(false);
      //console.log(cert.data.message);
      setCert(cert.data);
      setGenComplete(true);
      setreview(true);
    } catch (err) {
      setStartGen(false);
      console.log(err);
      setMessage(err.message);
      setIsError(true);
    }
  };

  const homeRedirect = () => {
    alert("Certificate Downloaded.");
    window.location = process.env.REACT_APP_API;
  };

  const downloadCert = async (e) => {
    try {
      setStartGen(true);
      const certFile = await axios.get(`${API}/download`);
      const blob = new Blob([certFile.data], {
        type: "text/plain;charset=utf-8",
      });
      setStartGen(false);

      setCert(certFile.data);
      saveAs(blob, "certificate.csr");
      setDownload(true);

      setTimeout(homeRedirect, 3000);
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
      setStartGen(false);
      alert(err.message);
    }
  };

  const handleCloseAlert = () => {
    setIsError(!true);
  };

  return (
    <>
      <Alert
        isOpen={isError}
        message={message}
        handleClose={handleCloseAlert}
      />
      <form onSubmit={handleSubmit}>
        <Step detail={detail} review={review} download={download} />

        <div className="ui form">
          {isLoading ? (
            <div>
              <div className="field">
                <label style={{ marginTop: "25px" }}>
                  {genComplete ? "Certificate" : "INF File"}
                </label>
                <textarea value={cert}>{cert}</textarea>
              </div>
              {genComplete ? (
                <span
                  className={
                    startGen
                      ? "ui positive loading button"
                      : "ui positive button"
                  }
                  onClick={downloadCert}
                >
                  Download &nbsp;&nbsp;<i className="download icon"></i>
                </span>
              ) : (
                <span
                  className={
                    startGen
                      ? "ui positive loading button"
                      : "ui positive button"
                  }
                  onClick={GenCert}
                >
                  Generate &nbsp;&nbsp;<i className="play icon"></i>
                </span>
              )}
            </div>
          ) : (
            <>
              <h2 className="ui right" style={{ marginTop: "25px" }}>
                Fill in the Following Fields
              </h2>
              <div className="field">
                <label>Friendly Name</label>
                <input
                  className="ui transparent input"
                  type="text"
                  placeholder="Friendly Name"
                  onChange={(e) => setFriendlyName(e.target.value)}
                  value={friendlyName}
                  name="friendlyName"
                  required
                />
              </div>
              <div className="field">
                <label>Alternate Name</label>
                <input
                  className="ui transparent input"
                  type="text"
                  placeholder="Alternate Name"
                  onChange={(e) => setAName(e.target.value)}
                  value={aName}
                  name="AN"
                  required
                />
              </div>
              <div className="field">
                <label>Common Name:</label>
                <input
                  type="text"
                  placeholder="Common Name"
                  onChange={(e) => setCommonName(e.target.value)}
                  value={commonName}
                  name="CN"
                  required
                />
              </div>
              <div className="field">
                <label>Organizational Unit</label>
                <input
                  type="text"
                  placeholder="Organizational Unit"
                  onChange={(e) => setOU(e.target.value)}
                  value={Ou}
                  name="OU"
                  required
                />
              </div>
              <div className="field">
                <label>Organization</label>
                <input
                  type="text"
                  placeholder="Organization"
                  onChange={(e) => setOrganization(e.target.value)}
                  value={Organization}
                  name="O"
                  required
                />
              </div>
              <div className="field">
                <label>Name of City:</label>
                <input
                  type="text"
                  placeholder="Name of City"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  name="L"
                  required
                />
              </div>
              <div className="field">
                <label>State or Province</label>
                <input
                  type="text"
                  placeholder="State or Province"
                  onChange={(e) => setProvince(e.target.value)}
                  value={province}
                  name="S"
                  required
                />
              </div>
              <div className="field">
                <label>Name of Country</label>
                <input
                  type="text"
                  placeholder="Name of Country"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  name="C"
                  required
                />
              </div>
              <button className="ui positive button" type="submit">
                Submit &nbsp;&nbsp;<i className="play icon"></i>
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default Form;
