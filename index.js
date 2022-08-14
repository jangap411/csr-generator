const express = require("express");
const http = require("http");
const fs = require("fs");
const { spawn } = require("node:child_process");
const morgan = require("morgan");
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.post("/file", async (req, res) => {
  //create inf file

  try {
    const { CN, OU, O, L, S, C, friendlyname, AN } = req.body;

    const file = ` 
    [Version]
    Signature = "$Windows NT$"

    [NewRequest]
    Subject = "CN=${CN}, OU=${OU}, O=${O}, L=${L}, S=${S}, C=${C}"
    FriendlyName = "${friendlyname}"
    KeySpec = "AT_KEYEXCHANGE"
    KeyAlgorithm = RSA
    KeyUsage = "CERT_DIGITAL_SIGNATURE_KEY_USAGE | CERT_KEY_ENCIPHERMENT_KEY_USAGE"
    KeyLength = 2048
    HashAlgorithm = SHA256
    Exportable = TRUE
    MachineKeySet = TRUE
    SMIME = FALSE
    PrivateKeyArchive = FALSE
    UserProtected = FALSE
    UseExistingKeySet = FALSE
    ProviderName = "Microsoft RSA SChannel Cryptographic Provider"
    ProviderType = 12
    RequestType = PKCS10 
    
    [Extensions]
    2.5.29.17 = "{text}"
    _continue_ = "dns=${CN}&"
    _continue_ = "dns=${AN}}&"

    [EnhancedKeyUsageExtension]
    OID = 1.3.6.1.5.5.7.3.1
    OID = 1.3.6.1.5.5.7.3.2`;

    await fs.writeFile("csr_temp.inf", file, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: err });
      }
      console.log("file create successfully");
    });

    res.status(201).send(file);

    //res.send(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//gen certificate

app.get("/cert", async (req, res) => {
  try {
    //const inf = `${__dirname}/csr_temp.inf`;

    console.log("\nHello.....\n");

    if (fs.existsSync("./new_req.csr")) {
      console.log("file deleted");
      fs.unlinkSync("./new_req.csr");
    }

    //start generate certificate
    const bat = spawn("cmd.exe", ["/c", "gen_cert.bat"]);
    const cert = `${__dirname}/new_req.csr`;

    bat.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    bat.stderr.on("data", (data) => {
      console.error(data.toString());
      //res.status(500).json({ message: data.toString() });
    });

    bat.on("exit", (code) => {
      console.log(`Child Process exited with code ${code}`);
      // Window.location = "/new_req.csr";
      //res.status(200).json({ message: cert });
      res.status(200).download(cert);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/download", (req, res) => {
  const cert = `${__dirname}/new_req.csr`;
  const inf = `${__dirname}/csr_temp.inf`;

  res.status(200).download(cert);
  console.log("\nHello.....\n");
  //remove();
  //fs.unlink(inf);
});

const remove = () => {
  fs.unlink("new_req.csr");
  console.log("....new_req.csr......");
};
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`\nServer listening on PORT:${PORT}\n`);
});
