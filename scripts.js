
const departmentMap = {
    "Egypt" : 10,
    "Knights" : 4,
    "African" : 5, 
    "European" : 12,
    "Greek" : 13,
    "American" : 1,
    "Printmaking" : 9,
    "Islamic": 14,
    "Asian": 6
}

let artworkType = "";
let artistName = "";
let title = "";
let period = "";
let departmentId;
let departmentName = "";
let labelClicked = false;
let originalRect = null;
let objectIDs = [];
let currentId;
let usedLetters = [];
let prevIds = [];
let prevIndex = -1;
let currentIndex = -1;
let inPrevArray = false;


let queryLetters = "abcdefghijlmnoprstuw";




 //Back button handling
$(document).ready(function(){
    $("#backButton").click(function(){
        const output = document.getElementById("outputImage");
        $("#map_image").show();
        $("#backButton").hide();
        $("#nextButton").hide();
        $("#prevButton").hide();
        $("#galleryText").show();
        $("#similarText").hide();
        $("#similarButton").hide();
        $("#label").hide();
        $(".artwork_container").css({
            visibility: "hidden"
        });

        output.src = "";
        const label = document.getElementById("labelText");
        label.innerHTML = "";

        window.scrollTo(0, 0);
        
        
    });
});

//Next button handling
/*$(document).ready(function(){
    $("#nextButton").click(function () {
        if(!inPrevArray){
            prevIds.push(currentId);
            currentIndex++;
            const id = objectIDs[currentIndex];
            $("#overlay2").fadeIn(300);
            prevIndex = prevIds.length - 1;
            fetchAndDisplayImage(id).catch(err =>{
                $("#overlay2").fadeOut(300);
            });
        }
        else{
            prevIndex++;
            console.log(prevIndex);
            console.log(prevIds);
            console.log(prevIds.length);
            let id = "";
            if(prevIndex == prevIds.length - 1){
              id = objectIDs[currentIndex];
              inPrevArray = false;
            }
            else{
              id = prevIds[prevIndex];
            }
            fetchAndDisplayImage(id).catch(err =>{
                $("#overlay2").fadeOut(300);
            });
        }
        
    });
});

$(document).ready(function(){
    $("#prevButton").click(function () { 
        
            const id = prevIds[prevIndex];
            $("#overlay2").fadeIn(300);
            inPrevArray = true;
            fetchAndDisplayImage(id).catch(err =>{
                $("#overlay2").fadeOut(300);
            });
            if(prevIndex != 0){prevIndex--};
           
        
       
    });
});*/

$(document).ready(function () {
    $("#nextButton").click(function () {
        // If we're still in previously viewed history
        if (inPrevArray && prevIndex + 1 < prevIds.length) {
            prevIndex++;
            const id = prevIds[prevIndex];
            $("#overlay2").fadeIn(300);
            fetchAndDisplayImage(id).catch(() => $("#overlay2").fadeOut(300));

            // If we reach the end of history, we're switching back to new images
            if (prevIndex === prevIds.length - 1) {
                inPrevArray = false;
            }
        } else {
            // Fetch new image from objectIDs
            currentIndex++;
            if (currentIndex >= objectIDs.length) return; // No more items

            const id = objectIDs[currentIndex];
            //prevIds.push(id);
           // prevIndex = prevIds.length - 1; // update history pointer
            inPrevArray = false;

            $("#overlay2").fadeIn(300);
            fetchAndDisplayImage(id).catch(() => $("#overlay2").fadeOut(300));
        }
    });

    $("#prevButton").click(function () {
        if (prevIndex > 0) {
            prevIndex--;
            const id = prevIds[prevIndex];
            inPrevArray = true;
            console.log(prevIndex);
            $("#overlay2").fadeIn(300);
            fetchAndDisplayImage(id).catch(() => $("#overlay2").fadeOut(300));
        }
    });
});

//similar button handling
$(document).ready(function(){
    $("#similarButton").click(function(){
        const text = document.getElementById("similarText");
        if(artworkType != ""){
            fetchNew(departmentId, artworkType);
            $("#similarText").show();
            text.innerHTML = `showing: ${artworkType} from department: ${departmentName}`;
        }
        else{
            text.innerHTML = "No similar items";
            $("#similarText").fadeIn(300, function () {
                setTimeout(() => {
                    $("#similarText").fadeOut(300);
                }, 1000); // waits 1 second before fading out
            });
        }
        console.log(`showing: ${artworkType} from department: ${departmentName}`);
        

    });
});


//Handle mousing over/out of map image
$(document).ready(function(){
    $('area').mouseenter(function () {
        const text = document.getElementById("galleryText");
        let title = this.title;
        capitalizeFirstLetter(title);
        text.innerHTML = title
    });

    $("#map_image").mouseleave(function () {
        const text = document.getElementById("galleryText");
        text.innerHTML = "Choose a gallery:"
    });
});



//Image map handling -- fetches first image
$(document).ready(function(){
    $('area').click(function () {
        console.log(this.title);
        $("#map_image").hide();
        $("#backButton").show();
        $("#nextButton").show();
        $("#similarButton").show();
        $("#prevButton").show();
        $("#label").show();
        $("#galleryText").hide();
        $("#label").css({
            visibility: "visible"
        });
        $(".artwork_container").css({ visibility: "visible" });
        $("#overlay2").fadeIn(300);
    
        const output = document.getElementById("outputImage");
        departmentId = departmentMap[this.title];
        departmentName = this.title;
        const query = getRandomLetter();
        fetchNew(departmentId,query);
    
    });
});

//Interactive label handling 
$(document).ready(function(){
    const label = document.getElementById("labelText");
    $("#label").click(function(e){
        e.stopPropagation();
        if (labelClicked) return;

        // Show overlay
        $("#overlay").fadeIn(300);

        // Animate to center using only transform
        $(this).css({
            transform: "translate(-50%, -50%) scale(1.5)",
            position: "relative",
            top: "50%",
            left: "50%",
        });

        // Add metadata
        label.innerHTML += `<br />Artist: ${artistName}<br />Date: ${period}`;
        labelClicked = true;
    });

    $("#label").hover(
        function () {
            if (!labelClicked) $(this).css("transform", "scale(1.1)");
        },
        function () {
            if (!labelClicked) $(this).css("transform", "scale(1)");
        }
    );

    $(document).click(function () {
        if (labelClicked) {
            $("#overlay").fadeOut(300);
            label.innerHTML = title;
            labelClicked = false;

            // Revert transform, top/left
            $("#label").css({
                transform: "none",
                top: "0",
                left: "0"
            });
        }
    });
});

//Pre warming for label to prevent weirdness 
$(document).ready(function () {
     const $label = $("#label");

    const originalStyles = {
        position: $label.css("position"),
        top: $label.css("top"),
        left: $label.css("left"),
        transform: $label.css("transform"),
        visibility: $label.css("visibility")
    };

    $label.css({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1.5)",
        visibility: "hidden"
    });

    $label[0].offsetHeight;

    $label.css(originalStyles);
});

//function to fetch fresh image when similar is clicked or when new area is clicked
//@departmentId: Id of department to fetch from
//@query: search term
function fetchNew(departmentId, query) {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&q=${query}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                objectIDs = data.objectIDs || [];
               // console.log(objectIDs);
                currentIndex = 0;
                const id = objectIDs[currentIndex];
                prevIds = [];
                prevIndex = -1;
                inPrevArray = false;
                fetchAndDisplayImage(id);
            });
}

//function to fetch images -- recursively requests until artwork with available image is found
function fetchAndDisplayImage(id) {
    return new Promise((resolve, reject) => {
        if (currentIndex >= objectIDs.length) {
            alert("End of gallery.");
            $("#overlay2").fadeOut(300);
            return reject(new Error("No more images."));
        }

        const output = document.getElementById("outputImage");
        

        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data2 => {
                if (data2.primaryImageSmall) {
                    $("#overlay2").fadeOut(300);
                    output.src = data2.primaryImageSmall;
                   // console.log(data2);
                    artistName = data2.artistDisplayName || "Unknown";
                    period = data2.objectDate;
                    title = data2.title;
                    currentId = data2.objectID
                    if (!inPrevArray && !prevIds.includes(id)) {
                        prevIds.push(id);
                        prevIndex = prevIds.length - 1;
                    }
                    console.log(prevIds);
                    //console.log(`currentID: ${currentId}`);
                    artworkType = data2.classification.replace("-", " & ");
                    document.getElementById("labelText").innerHTML = title;

                    resolve();
                } else {
                    currentIndex++;
                    fetchAndDisplayImage(objectIDs[currentIndex]).then(resolve).catch(reject); // Try next
                }
            })
            .catch(error => {
                console.error(error);
                $("#overlay2").fadeOut(300);
                reject(error);
            });
    });
}
//function to choose random letter for search query, meaning each "revisit" to a gallery yeilds different artworks
function getRandomLetter(){
    const randomInd = Math.floor(Math.random() * queryLetters.length);
    //console.log(queryLetters);
    //console.log(`removing: ${queryLetters.charAt(randomInd)}`)
    let char = queryLetters.charAt(randomInd);
    queryLetters = queryLetters.replace(char,"");
    if(queryLetters.length == 0){
        queryLetters = "abcdefghijlmnoprstuw";
    }
    return char;
    
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}




/*Debug functions

function clicked(department){
    console.log(`clicked ${department}`);
    
}


window.onload = function(){
    document.getElementById("modern").onmouseenter = function(){clicked("hello");}
}*/