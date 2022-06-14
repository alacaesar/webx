import vars from "../tools/vars";

let body, header;

export default class Builder {
    constructor(callback) {

        body = document.body;
        header = document.querySelector("header");

        this.init(callback);
    }

    init(callback) {
        const _this = this;

        fetch("/data.json")
        .then(response => response.json())
        .then(data => {

            if(pageType == "home"){
                _this.makeCollection(data.collection);
                _this.makeOverview(data);
                _this.makeDesigners(data.designers);
                _this.makeInterviews(data.interviews);
            }
            else{
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const ID = urlParams.get("p");

                if(pageType == "nft")
                    _this.makeNFT(data, ID);
                else if(pageType == "interview")
                    _this.makeInterview(data, ID);
            }
            _this.makeCredits(data.credits);

            setTimeout(()=>{ if(callback) callback(); }, 111);
        
        });

        if(!vars.isMobile){
            header.classList.add("extended");
        }
    }

    makeCollection(arr){
        const left = document.querySelector("#collection .inside .left");
        const right = document.querySelector("#collection .inside .right");
        left.innerHTML = "";
        right.innerHTML = "";

        arr.forEach((item, i) => {    
            let article = document.createElement("article");
                article.innerHTML = `<figure>
                                        <video src="${item.video}" poster="${item.cover}" loop preload="metadata" playsinline muted></video>
                                    </figure>
                                    <div>
                                        <a href="${item.url}" target="blank" rel="nofollow" class="button" title="Bid on this"><span>Bid on this</span><i></i></a>
                                        <a href="/nft/?p=${i}" class="link" title="VIEW DETAILS"><span>VIEW DETAILS</span></a>
                                    </div>`;

            if(i % 2 == 0)
                left.appendChild(article);
            else
                right.prepend(article);
        });
    }

    makeOverview(arr){
        const container = document.querySelector("#overview .inside .grid");
        container.innerHTML = "";

        arr.collection.forEach((item, i) => {
            let zoom = 2;

            let article = document.createElement("li");
                article.setAttribute("style", "background-image:url("+ item.cover +")");
                article.innerHTML = "<small>" + item.name + "</small>";

                if(i < zoom)
                    article.setAttribute("class", "drop"+(i+1)+" left");
                else if(i > zoom)
                    article.setAttribute("class", "drop"+(i+1)+" right");
                else
                    article.setAttribute("class", "drop"+(i+1)+" zoom");

            container.appendChild(article);
        });
    }

    makeDesigners(arr){
        const container = document.querySelector("#designers ul.profiles");
        container.innerHTML = "";

        arr.forEach((item, i) => {
            let article = document.createElement("li");
                article.innerHTML = `<div style="background-image:url( ${item.photo} )">
                
                <svg class="scroll" viewBox="0 0 500 500">
                    <defs>
                        <path d="M50,250c0-110.5,89.5-200,200-200s200,89.5,200,200s-89.5,200-200,200S50,360.5,50,250" id="textcircle">
                        </path>
                    </defs>
                    <text dy="0">
                        <textPath xlink:href="#textcircle">${item.name}</textPath>
                    </text>
                </svg>

                </div>`;
            Math.random() < .5 ? container.appendChild(article) : container.prepend(article);
        });
    }

    makeInterviews(arr){
        const container = document.querySelector("#interviews .inside ul");
        container.innerHTML = "";

        arr.forEach((item, i) => {
            let article = document.createElement("li");
                article.innerHTML = `<div>
                                        <a class="imageLink" href="/interview/?p=${i}">
                                            <figure>
                                                <img width="336" height="420" alt="${item.type}" src="${item.thumbnail}">
                                                <svg width="336" height="420" viewbox="0 0 336 420"><use href="assets/icons/icons.svg#mozaic0${i+1}"></svg>
                                            </figure>
                                            <span class="hide">${item.title}</span>
                                        </a>
                                        <div>
                                            <div class="interview-title">
                                                <i>${item.type}</i>
                                                <p class="large">${item.title}</p>
                                                <p class="medium">${item.author}</p>
                                            </div>
                                            <a href="/interview/?p=${i}" class="link red" rel="nofollow" target="blank" title="READ NOW">
                                                <span>READ NOW</span>    
                                            </a>
                                        </div>
                                    </div>`;

            container.appendChild(article);
        });
    }

    makeCredits(arr){
        const container = document.querySelector(".credits .inside ul");
        container.innerHTML = "";

        arr.forEach((item, i) => {
            let article = document.createElement("li");
                article.innerHTML = `<b>${item.group}</b>`;
            
            container.appendChild(article);
            
            item.list.forEach((k, i) => {
                let listItem = document.createElement("li");
                    listItem.innerHTML = `<span>${k.name}</span><small>${k.role}</small>`;
                container.appendChild(listItem);
            });
        });
    }

    makeNFT(arr, ID){
        const videoContainer = document.querySelector("#nft .first .left");
        const infoContainer = document.querySelector("#nft .first .right");
        const descContainer = document.querySelector("#nft .second .copy");
        const mediaContainer = document.querySelector("#nft .second ul");
        const designerContainer = document.querySelector("#nft .third");

        const data = arr.collection[ID];
        const designer = arr.designers[data.designer];

        let figure = document.createElement("figure");
            figure.innerHTML = `<video src="${data.video}" poster="/${data.cover}" autoplay loop preload="metadata" playsinline muted></video>`;
        videoContainer.appendChild(figure);

        data.images.forEach((item, i) => {
            let li = document.createElement("li");
                li.innerHTML = `<figure><img src="/${item}"></figure>`;
            mediaContainer.appendChild(li);
        });

        let linksHTML = "";
        if(designer.links.length > 0){
            designer.links.forEach((item, i) => {
                linksHTML += `
                    <li>
                        <a href="${item.url}" class="link red" rel="nofollow" target="blank" title="${item.type}">
                            <span>${item.type}</span>    
                        </a>
                    </li>`;
            });
        }

        infoContainer.innerHTML = `
            <div class="panel">
              <button class="close"><span class="hide">Close</span></button>
              
              <div class="title">
                <h1 class="name medium">${data.name}
                  <svg width="29" height="15">
                    <use href="/assets/icons/icons.svg#arrow"></use>
                  </svg>
                </h1>
                <p class="anim-words medium">${data.excerpt}</p>

                <div><i>${data.animal}</i><br/><i>DESIGNED BY</i></div>
                <div class="medium designer"><img src="/${designer.photo}"><span>${designer.name}</span></div>
              </div>
            </div>
            <a href="${data.url}" class="button" title="Bid on this"><span>Bid on this</span><i></i></a>
              `;
        
        designerContainer.innerHTML = `
                <aside class="left">
                    <img src="/${designer.photo}">
                </aside>
                <aside class="right">
                    <div class="designer-profile">
                        <p class="medium red">${designer.name}</p>
                        <p class="medium">${designer.bio}</p>
                    </div>
                    <ul>${linksHTML}</ul>
                </aside>
                `;

        descContainer.innerHTML = `
                <div class="text-columns">
                    <div>
                    <p class="anim-text small">${data.description}</p>
                    </div>
                </div>
                `;
    }

    makeInterview(arr, ID){
        const titleContainer = document.querySelector("#interview .first .top");
        const infoContainer = document.querySelector("#interview .first .left");
        const authorContainer = document.querySelector("#interview .first .right");

        const data = arr.interviews[ID]

        titleContainer.innerHTML = `
                <button class="close"><span class="hide">Close</span></button>
                <h1 class="large red">${data.title}</h1>
                <h2 class="large">${data.excerpt}</h2>
        `;

        infoContainer.innerHTML = `
                <div class="copy small">${data.content}</div>
                <i>${data.date}</i>
        `;

        authorContainer.innerHTML = `
                <figure>
                    <img width="336" height="420" alt="${data.type}" src="/${data.thumbnail}">
                    <svg width="336" height="420" viewbox="0 0 336 420"><use href="/assets/icons/icons.svg#mozaic01"></svg>
                </figure>
                <p class="medium">${data.author}</p>
        `;
    }
}