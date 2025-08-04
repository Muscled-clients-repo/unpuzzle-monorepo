class UserActivityInterface{
    constructor(){
        this.aiAgentLogWrapper=document.querySelector(".ai-agent-log-wrapper")
    }

    setLoading = (isLoading) =>{
        if(isLoading){  
            this.aiAgentLogWrapper.classList.add('loading');
        }else{
            this.aiAgentLogWrapper.classList.remove('loading');
        }
    }

    update=(data)=>{
        console.log(data);
        let logBody = ``
        for(let i=0;i<data.length;i++){
            const formatedtime= window.ytPlayer.getFormattedTime(data[i].duration)
            logBody += `<li class="flex items-center text-sm items-start gap-2">
            <img src="${ASSET_ORIGIN}/img/checkMark.svg" alt="AI Agent" class="mt-[3px] shrink-0">
            <div class="flex flex-row w-full gap-2">
                <p class="text-sm text-gray-500 flex-1">
                    ${data[i].title} - <span class="text-[#00AFF0]">${formatedtime}</span>
                </p>
            </li>`
        }

        this.aiAgentLogWrapper.innerHTML += logBody;
    }

    init = ()=>{
        this.update();
    }
}

export default UserActivityInterface;