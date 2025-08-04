class TestApi{
    constructor(){
        this.buttons=document.querySelectorAll(".api-test")
    }

    get=async(endpoint)=>{
        try{
            const response = await fetch(endpoint)
            if(!response.ok){
                throw new Error("Error fetching data")
            }
            const data = await response.json()

            console.log(data)
        }catch(error){
            console.log(error.message)
        }
    }

    init=()=>{
        this.buttons.forEach((button)=>{
            button.addEventListener("click", (e)=>{
                const elem = e.currentTarget
                const endpoint=elem.getAttribute("endpoint")
                const method=elem.getAttribute("method") || "get"
                const service=elem.getAttribute("service") || ""

                if(method=="get"){
                    this.get(`${service}${endpoint}`)
                }
            })
        })

    }
}

const testApi = new TestApi();
testApi.init();