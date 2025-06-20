async function expenseForm(event) {
    try {
      event.preventDefault();
      const domainIP = "13.201.129.81";
      console.log(domainIP)
      const amount = event.target.amount.value;
      const description = event.target.itemDescription.value;
      const category = event.target.category.value;
      const lengthOfRowPerPage = document.getElementById("selectPage");
      const dataObj = {
        amount: amount,
        description:  description,
        category: category
      }


     if(category == "Income"){

      const authTokenJwt = localStorage.getItem("token");
      const z = Math.random()*10
      const z1 = parseFloat(z.toFixed(4))
      const incomeRes = await axios.post(
        "http://localhost:3000/registerIncome",
        dataObj,
        { headers: { Authorization: authTokenJwt } }
      );
      
      const trTbody = document.createElement("tr")
      const button2 = document.createElement("button")
      const delTd1 = document.createElement("td")
      const tbody = document.getElementById("tbody")
      const utcDate= new Date(incomeRes.data.data.createdAt)
      const localDate = utcDate.toDateString()
      let dataArr= [localDate, incomeRes.data.data.description, incomeRes.data.data.category, incomeRes.data.data.amount, ""]
      
      
      dataArr.forEach((tdText)=>{
        let td = document.createElement("td")
        td.innerText = tdText
        trTbody.appendChild(td)
      })
      /*  For delete functionality */
      button2.textContent = "Delete";
      button2.className = "fa fa-trash";
      button2.id = `${z1}`;
      button2.addEventListener("click", () => deleteExpenses(z1, category, amount, description))
      delTd1.className ="delete-button"
      delTd1.appendChild(button2);
      trTbody.appendChild(delTd1)
      tbody.appendChild(trTbody)
      
     }else{
      

      const UTCDate = new Date()
      const x = Math.random()*100
      const y = parseFloat(x.toFixed(4))
      localDate = UTCDate.toDateString()

      const ele = document.createElement("tr")
      const deleteTd = document.createElement("td");
      deleteTd.className = "delete-button"
      const button1 = document.createElement("button")
      const tbody = document.getElementById("tbody")
      let tdHeader = [localDate, description, category, "", amount]

      for(let i =0; i<tdHeader.length; i++){
        let td = document.createElement("td");
        td.innerText = tdHeader[i]
        ele.appendChild(td)
      }
      /*  For delete functionality */
      button1.textContent = "Delete";
      button1.className = "fa fa-trash";
      button1.id = `${y}`;
      button1.addEventListener("click", () => deleteExpenses(y, category, amount, description))

      deleteTd.appendChild(button1);
      ele.appendChild(deleteTd)
      tbody.appendChild(ele)
      
      
      const jwtToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/expenses/expenseForm",
        dataObj,
        { headers: { Authorization: jwtToken } }
      );
      
      
     }
     
     
    } 
    catch (error) {
      throw new Error(error);
    }
  }      
  
  function showPremiumUserMsg(){
     document.getElementById("rzp-button1").style.display = "none";
      document.getElementById("ispremium").textContent = "you are a premium user"
      document.getElementById("ispremium").style.color= "white"
      document.getElementById("ispremium").style.fontSize= "10px"
      document.getElementById("ispremium").style.textAlign= "center"
     
  }

  function parseJwt (token) {
    
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
  }

  function showAllLeaderboardUser(){
    const leaderboard = document.getElementById("premiumLeaderBoard")
    leaderboard.style.display = "block"

    // leaderboard.addEventListener("click", async function(e){
    //   const showLeaderboard = document.getElementById("showLeaderboard")
    //   const tbody = document.getElementById("tbodyshowLeaderboard")
    //   showLeaderboard.style.display = "block"
      

    //     const token = localStorage.getItem("token");
    //     const getAllLeaderboardUser = await axios.get("http://localhost:3000/leaderboardAllUser", { headers: {Authorization: token }});
        
    //     console.log(getAllLeaderboardUser)
    //     getAllLeaderboardUser.data.arrOfAllUsers.forEach(data=>{
    //       // console.log(data)
    //       const trTbody = document.createElement("tr")


    //     })
    //     const activeUser = getAllLeaderboardUser.data.user
    //     const leaderboardUsers= getAllLeaderboardUser.data.arrOfAllUsers

    //     for(let i=0; i<leaderboardUsers.length; i++)
    //     {
    //       const trTbody = document.createElement("tr")
    //       let allData = [i+1, leaderboardUsers[i].username, leaderboardUsers[i].totalCost]

    //       if(leaderboardUsers[i].id ==activeUser.userId && leaderboardUsers[i].username == activeUser.name){
    //         const td1 = document.createElement("td")
    //         const td2 = document.createElement("td")
    //         const td3 = document.createElement("td")
    //         td1.textContent = allData[0]
    //         td2.textContent = `${allData[1]} (You)`
    //         td3.textContent = allData[2]
    //         trTbody.appendChild(td1)
    //         trTbody.appendChild(td2)
    //         trTbody.appendChild(td3)
    //         tbody.appendChild(trTbody)
            
    //       }
    //       else{
    //         allData.forEach(data =>{

    //           const td = document.createElement("td")
    //           td.innerText = data
    //           trTbody.appendChild(td)
              
    //         })
            
    //         tbody.appendChild(trTbody)

    //       }

    //     }
        
    // })

  }
  
  
  document.addEventListener("DOMContentLoaded", async () => {
    
    const token = localStorage.getItem("token")
    const rowsPerPage= localStorage.getItem("selectPagePreference")
    const dailyWeeklyMonthlyYearlyData = localStorage.getItem("selectCalenderPreference")
    
    // console.log(token)
    const decodedToken = parseJwt(token)
    let page =1
    console.log(decodedToken)
    
    if(decodedToken.ispremiumuser == 1){
      showPremiumUserMsg()
      showAllLeaderboardUser()
      downloadDataFromS3()

    }
    const id = 1;

    const response = await axios.get(
      `http://localhost:3000/expenses/expenseAllData/${page}`,
      { headers: { Authorization: token },
      params:{
        rowsPerPage:rowsPerPage,
        dailyWeeklyMonthlyYearlyData: dailyWeeklyMonthlyYearlyData

      }
    }
    );

    console.log("response", response)
    const url = `http://localhost:3000/abc/${id}`
    const ANB = await axios.get(url,
    { params:{
        pageId:page,
        username: "anujkumar"
      },
      headers: { Authorization: token }
    },
    
    );
    
    // console.log(incomeResponse)
    localStorage.setItem("totalamount", response.data.totalExpense)
    
    
    for (let i = 0; i < response.data.allData.length; i++) {
      
      showExpenseOnScreen(response.data.allData[i]);
    }
    showPagination(response.data.lastPage)
    
  });


  function showExpenseOnScreen(event) {
    console.log(event)
    // let table = document.getElementById("table");
    const tbody = document.getElementById("tbody")
  
    const button = document.createElement("button")
    const trTbody = document.createElement("tr")
    trTbody.innerHTML = ``
    const delTd = document.createElement("td") /* for delete function implementation */
    delTd.className = "delete-button"
    const utcDate = new Date(event.createdAt)
    const localDate = utcDate.toDateString()
    
    let tdHeaders =[]
    if(event.category == "Income"){
      tdHeaders = [localDate, event.description, event.category, event.amount, ""]
    }
    else{
      tdHeaders = [localDate, event.description, event.category, "", event.amount]
    }

    tdHeaders.forEach((tdText)=>{
      let td = document.createElement("td")
      td.innerText = tdText
      trTbody.appendChild(td)
    })
   
    // for delete implementation in our app

    button.textContent= "Delete"
    button.className = "fa fa-trash"
    button.id= event.id
    delTd.appendChild(button)
    button.addEventListener("click", () => deleteExpenses(event.id, event.category, event.amount, event.description))
    trTbody.appendChild(delTd)

    tbody.appendChild(trTbody)
  }

  function showPagination(lastPage){
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""

    for(let i=1; i<=lastPage; i++){
      const btn = document.createElement("button");
      btn.innerHTML = i
      btn.className ="buttonPagination"; 
      btn.addEventListener("click", () => getExpenses(i))
      paginationContainer.appendChild(btn)
    }

  }

  async function getExpenses(page){
    const rowsPerPage = localStorage.getItem("selectPagePreference")
    const dailyWeeklyMonthlyYearlyData = localStorage.getItem("selectCalenderPreference")
    const tbody = document.getElementById("tbody")
    tbody.innerHTML = ""
    const token = localStorage.getItem("token")
    const res = await axios.get(`http://localhost:3000/expenses/expenseAllData/${page}`, { 
      headers: { Authorization: token },
      params:{
        rowsPerPage: rowsPerPage,
        dailyWeeklyMonthlyYearlyData: dailyWeeklyMonthlyYearlyData
      }
    });

    for (let i = 0; i < res.data.allData.length; i++) {
      showExpenseOnScreen(res.data.allData[i]);
    }

    showPagination(res.data.lastPage)
    

  }

  async function deleteExpenses(id, category, amount, description){
    const token = localStorage.getItem("token")
    const parsedObj = parseJwt(token)
    const currentUser = parsedObj.userId
    console.log(id, category, amount, description, token)

    const deleteEle = document.getElementById(id)
    console.log(deleteEle.parentElement.parentElement)
    deleteEle.parentElement.parentElement.remove()
    console.log(id, category, amount, description)

    
    const deleteExpense = await axios.delete(`http://localhost:3000/deleteExpense`, 
      { headers: { Authorization: token },
        params:{
          id: id,
          category: category,
          amount: amount,
          description: description,
          currentUser: currentUser
        }
      }
    )
    console.log(deleteExpense)
     


  }
  

  
  document.getElementById('rzp-button1').onclick = async function(e){
    console.log("Razorpay got clicked")
    const token = localStorage.getItem("token");
    
    const response = await axios.get("http://localhost:3000/buyPremiumMembership", { headers: { Authorization: token }});
    
    
    var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id,
      "currency": "INR",
      "name": "Acme Corp", //your business name
      "handler": async function(response){
        const data = await axios.post("http://localhost:3000/updatePremiumMembership",{
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id

        }, { headers: { Authorization: token }})
        
        
        alert("You are a premium user now")
        showPremiumUserMsg()
        localStorage.setItem("token", data.data.token)
        showAllLeaderboardUser()
        downloadDataFromS3()

      }
      
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function(response){
      const reponse = await axios.post("http://localhost:3000/updateErrorPremiumMembership",{
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id
          
        }, { headers: { Authorization: token }})
      console.log("Something went wrong");
      alert("Something went wrong")
    })


  }
  
  
function selectTable(){
  const val = document.getElementById("selectPage").value
  localStorage.setItem("selectPagePreference", val)
 
}

function getUserExpensePreference(){
  const val = document.getElementById("getUserDataPreference").value
  
  localStorage.setItem("selectCalenderPreference", val)
 
}

function downloadDataFromS3(){
  document.getElementById("s3DataDownload").style.display = "block"
  const downloadExpense = document.getElementById("s3Button")

  downloadExpense.addEventListener("click", async(e)=>{
        e.preventDefault(); // Prevent default link behavior
    try {
      const getToken = localStorage.getItem("token");
      console.log(getToken)
      const S3response = await axios.get("http://localhost:3000/downloadS3Data", { headers: { Authorization: getToken }});
      if(S3response.status === 200){
        window.location.href = S3response.data.data

        console.log(S3response.data.data)

      }

    } catch (error) {
      console.log(error)
    }
  })

}
const leaderboard = document.getElementById("premiumLeaderBoard")
const tbodyshowLeaderboard = document.getElementById("tbodyshowLeaderboard")
leaderboard.addEventListener("click", async function(e){
  tbodyshowLeaderboard.textContent = ``
  const showLeaderboard = document.getElementById("showLeaderboard")
  const tbody = document.getElementById("tbodyshowLeaderboard")
  showLeaderboard.style.display = "block"
  

    const token = localStorage.getItem("token");
    const getAllLeaderboardUser = await axios.get("http://localhost:3000/leaderboardAllUser", { headers: {Authorization: token }});
    
    console.log(getAllLeaderboardUser)
    getAllLeaderboardUser.data.arrOfAllUsers.forEach(data=>{
      // console.log(data)
      const trTbody = document.createElement("tr")


    })
    const activeUser = getAllLeaderboardUser.data.user
    const leaderboardUsers= getAllLeaderboardUser.data.arrOfAllUsers
    let idx = 1
    leaderboardUsers.forEach(user =>{
      const trTbody = document.createElement("tr")
      const td1 = document.createElement("td")
      const td2 = document.createElement("td")
      const td3 = document.createElement("td")
      
      if(user.id === activeUser.userId){
        td1.textContent = idx
        td2.textContent = `${user.username} (You)`
        td3.textContent = user.totalCost
        trTbody.appendChild(td1)
        trTbody.appendChild(td2)
        trTbody.appendChild(td3)
        tbody.appendChild(trTbody)
        console.log(leaderboardUsers)
        idx++
      }
      else{
        console.log(leaderboardUsers)
        td1.textContent = idx
        td2.textContent = user.username
        td3.textContent = user.totalCost
        trTbody.appendChild(td1)
        trTbody.appendChild(td2)
        trTbody.appendChild(td3)
        tbody.appendChild(trTbody)
        idx++
      }
    })
    
})