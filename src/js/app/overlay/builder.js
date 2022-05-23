let body, header;

export default class Builder {
    constructor(callback) {

        body = document.body;
        header = document.querySelector("header");

        this.init(callback);
    }

    init(callback) {
        console.log("build");
        const _this = this;

        fetch("data.json")
        .then(response => response.json())
        .then(data => {

            _this.makeCollection(data.collection);
            _this.makeOverview(data);
            _this.makeDesigners(data.designers);

            setTimeout(()=>{ if(callback) callback(); }, 111);
        
        });
    }

    makeCollection(arr){
        const left = document.querySelector("#collection .inside .left");
        const right = document.querySelector("#collection .inside .right");
        left.innerHTML = "";
        right.innerHTML = "";

        arr.forEach((item, i) => {    
            let article = document.createElement("article");
                article.innerHTML = `<figure><video src="${item.video}" poster="${item.images[0]}" loop preload="metadata" playsinline muted></video></figure>
                                        <div>
                                        <a href="javascript:void(0);" class="button" title="Bid on this"><span>Bid on this</span><i></i></a>
                                        <a href="javascript:void(0);" class="link" title="View Details"><span>View Details</span></a>
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
                article.setAttribute("style", "background-image:url("+ item.images[0] +")");
                article.innerHTML = "<small>" + arr.designers[ item.designer ].name + "</small>";

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
                article.innerHTML = `<div style="background-image:url( ${item.photo} )"></div>`;
            Math.random() < .5 ? container.appendChild(article) : container.prepend(article);
        });
    }
}