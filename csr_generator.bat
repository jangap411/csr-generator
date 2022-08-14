@echo off
:: [[ Settings ]]
TITLE CSR GENERATOR
SETLOCAL ENABLEDELAYEDEXPANSION
set req_repo_name=request_repository
set req_repo_dir=%USERPROFILE%\%req_repo_name%
:: [[ CSR GENERATOR UTILITY MAIN SCREEN ]]
:main
echo.
echo CSR GENERATOR
echo Version 0.5.1
echo Date Updated: 20-05-2022
echo Developed and Maintained by the Application Development Unit ^| email: adu@fincorp.com.pg
echo.
set /p choice="Enter Y to continue or q to quit: "
if "%choice%" == "Y" (
   goto create_repo
)
exit
:: [[ CREATE CSR REPO DIRECTORY ]]
:create_repo
cls
echo --------------------------------
echo     CSR REPORISOTRY SETUP
echo --------------------------------
echo.
echo CSR Generator will create a Repository Directory in the following location
echo -------------------------------------------------------------------------
echo "C:\Users\{user_name}\request_repository"
echo -------------------------------------------------------------------------
echo You will only see this on the first run of this script
echo.
if NOT EXIST %req_repo_dir% (
    echo "%req_repo_name% not found!"
    echo ========================================
    echo.
    echo Proceeding to create %req_repo_name%
    mkdir %req_repo_dir%
    echo Repository created in the %req_repo_dir%
    echo.
    echo Press "Enter" to continue...
    pause >nul
    goto new_request
)
:: if repo exsits, got straight to new_request
goto new_request
:: [[ New Request CSR ]]
:new_request
cls
echo ---------------------------------------------------
echo                ENTER CSR SUBJECT FIELDS
echo ---------------------------------------------------
echo.
set /p friendlyname="Friendly Name: "
set /p CN="Common Name: "
(
    echo [Version]
    echo Signature = "$Windows NT$"
    echo.
    echo [NewRequest]
    echo Subject = "CN=%CN%, OU=Information Technology, O=Finance Corproation Limited, L=Port Moresby, S=NCD, C=PG"
    echo FriendlyName = "%friendlyname%"
    ::echo KeySpec = "AT_KEYEXCHANGE"
    echo KeyAlgorithm = RSA
    echo KeyUsage = "CERT_DIGITAL_SIGNATURE_KEY_USAGE | CERT_KEY_ENCIPHERMENT_KEY_USAGE"
    echo KeyLength = 4096
    echo HashAlgorithm = SHA512
    echo Exportable = TRUE
    echo MachineKeySet = TRUE
    echo SMIME = FALSE
    echo PrivateKeyArchive = FALSE
    echo UserProtected = FALSE
    echo UseExistingKeySet = FALSE
    echo ProviderName = "Microsoft RSA SChannel Cryptographic Provider"
    echo ProviderType = 12
    echo RequestType = PKCS10
) > %req_repo_dir%\csr_temp.inf
:: [[ Extension Section ]]
goto san
:san
cls
echo ---------------------------------------------------
echo        PROVIDE SUBJECT ALTERNATIVE NAMES
echo ---------------------------------------------------
echo.
set /p alternative_name="Enter Subject Alternative Name: "
(
   echo.
   echo [Extensions]
   echo 2.5.29.17 = "{text}"
   echo _continue_ = "dns=!alternative_name!&"
) >> %req_repo_dir%\csr_temp.inf
goto add_san
:: [[ Add Multiple SAN's Section ]]
:add_san
:: refactor this into an array, which makes things easier
set /p san_choice="Enter another SAN? (Y/n): "
if "%san_choice%" == "Y" (
    set /p new_alternative_name="Enter SAN here: "
    (
        echo _continue_ = "dns=!new_alternative_name!&"
    ) >> %req_repo_dir%\csr_temp.inf
    goto add_san
) else (
    goto enhanced_key_usage
)
:: [[ Enhanced Key Usage Extension Section ]]
:enhanced_key_usage
cls
echo ---------------------------------------------------
echo           SELECT AUTHENTICATION TYPE
echo ---------------------------------------------------
echo.
echo Enter
echo s for Server Authentication only
echo c for Client Authentication only
echo b for both Server and Client Authentication
echo.
set /p auth_type="Authentication Type: "
if "%auth_type%" == "s" (
    (
        echo.
        echo [EnhancedKeyUsageExtension]
        echo OID = 1.3.6.1.5.5.7.3.1
    ) >> %req_repo_dir%\csr_temp.inf
    echo Added server authentication CSR
    echo Press Enter to continue...
    pause >nul
    goto generate_csr
) else if "%auth_type%" == "c" (
    (
        echo.
        echo [EnhancedKeyUsageExtension]
        echo OID = 1.3.6.1.5.5.7.3.2
    ) >> %req_repo_dir%\csr_temp.inf
    echo Added client authentication only to CSR
    echo Press Enter to continue...
    pause >nul
    goto generate_csr
) else (
    (
        echo.
        echo [EnhancedKeyUsageExtension]
        echo OID = 1.3.6.1.5.5.7.3.1
        echo OID = 1.3.6.1.5.5.7.3.2
    ) >> %req_repo_dir%\csr_temp.inf
    echo Added client and server authentication to CSR
    echo Press Enter to continue...
    pause >nul
    goto generate_csr
)
:: [[ Generation of CSR Request ]]
:generate_csr
cls
echo ---------------------------------------------------
echo                 GENERATE CSR
echo ---------------------------------------------------
echo.
set /p name_of_req="Enter name of csr template: "
certreq -new %req_repo_dir%\csr_temp.inf %req_repo_dir%\%name_of_req%.csr && echo Please check %req_repo_dir% for certificate request
echo.
echo Do you wish to validate %name_of_req%.csr?
echo Enter:
echo Y to view %name_of_req%.csr
echo n to exit CSR Generate
echo.
set /p csr_check_choice="choice?: "
if "%csr_check_choice%" == "Y" (
   goto check_csr
)
:: goto eof if user enters q
goto eof
pause >nul
goto eof
:: [[ Validate CSR ]]
:check_csr
cls.
echo ---------------------------------------------------
echo                    CSR CHECK
echo ---------------------------------------------------
echo.
certutil -dump %req_repo_dir%\%name_of_req%.csr
echo.
echo Press Enter to quit when done
pause >nul
goto eof
:: [[ Exit Program ]]
:eof
cls
echo Performing house keeping...
del /Q %req_repo_dir%\csr_temp.inf
echo House keeping complete!
echo Press Enter to exit
pause >nul
exit