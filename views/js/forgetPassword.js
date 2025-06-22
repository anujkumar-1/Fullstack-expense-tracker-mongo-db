async function forgotPassword(event) {
    event.preventDefault();
    const domainIP = "13.201.129.81";
    console.log(domainIP)
    const email = event.target.email.value
    const token = localStorage.getItem("token")
    let forgotEmail ={
        email: email
    }
    const responseForgotPassword = await axios.post("http://localhost:3000/password/forgotpassword", forgotEmail,
    { headers: { Authorization: token} })

    
    if(responseForgotPassword.status===200){
        const sucessResponse = document.getElementById("sucessMsg")
        sucessResponse.style.display = "block"
    }
    else{
        const failureMsg = document.getElementById("sucessMsg")
        failureMsg.style.innerHTML = `<p>Try again later.</p>`
        throw new Error("Failed to login")
    }
    
}