import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Step from "./Step";

const Form = () => {
  const API = "http://localhost:5000";

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
  };

  const GenCert = async () => {
    setStartGen(true);
    const cert = await axios.get(`${API}/cert`);
    console.log("Gen cert...");
    setStartGen(false);
    console.log(cert.data.message);
    setCert(cert.data);
    setGenComplete(true);
    setreview(true);
  };

  const downloadCert = async (e) => {
    const certFile = await axios.get(`${API}/download`);
    const blob = new Blob([certFile.data], {
      type: "text/plain;charset=utf-8",
    });
    setCert(certFile.data);
    saveAs(blob, "new_cert.csr");
    console.log(certFile.data);
    setDownload(true);

    window.location = "http://localhost:3000/";
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Step detail={detail} review={review} download={download} />
        {/* <span style={{ marginTop: "1000px" }}></span> */}
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
                  Download &nbsp;&nbsp;<i class="download icon"></i>
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
              <h2 className="ui right">Fill in the Following Fields</h2>
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
              <button className="ui secondary button" type="submit">
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
