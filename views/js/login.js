async function login(event){
    try {
        event.preventDefault();
        const domainIP = "13.201.129.81";
        console.log(domainIP)
        const email= event.target.email.value;
        const password= event.target.password.value;

        let loginObj = {
           verifyEmail: email,
           verifyPassword: password
        }
        console.log(loginObj)
        const response = await axios.get('http://localhost:3000/users/login', {params: {
            verifyEmail: email,
            verifyPassword: password
        }})
        console.log(response.data.token)
        localStorage.setItem("token", response.data.token)
        console.log(response.data.user)
       
        const div = document.getElementById("message")
        div.textContent=response.data.message
        console.log(response)
        div.style.color="rgb(108, 99, 255)"
        
        if(response.status===200){
            window.location.href= "./Homepage.html"
        }
        else{
            throw new Error("Failed to login")
        
        }

        

        

    } catch (error) {
        const div = document.getElementById("message")
        div.textContent = error.response.data.message
        div.style.color="red"
        
    }
    
}