
const departmentMap = {
    "egypt" : 10,
    "knights" : 4,
    "africa" : 5, 
    "decorative" : 12,
    "greek" : 13,
    "american" : 1,
    "photos" : 9,
    "islamic": 14
}

let artistName = "";
let title = "";
let period = "";
let labelClicked = false;
let originalRect = null;
let objectIDs = [];
let currentIndex = 0;


const queryLetters = "abcdefghijlmnoprstuw"

function getRandomLetter(){
    const randomInd = Math.floor(Math.random() * queryLetters.length);
    console.log(queryLetters.charAt(randomInd));
    return queryLetters.charAt(randomInd);
    
}

 
$(document).ready(function(){
    $("#backButton").click(function(){
        const output = document.getElementById("outputImage");
        $("#map_image").show();
        $("#backButton").hide();
        $("#nextButton").hide();
        $(".artwork_container").css({
            visibility: "hidden"
        });

        output.src = "";
        const label = document.getElementById("labelText");
        label.innerHTML = "";

        
        
    });
});

$(document).ready(function(){
    $('area').click(function () {
        console.log(this.title);
        $("#map_image").hide();
        $("#backButton").show();
        $("#nextButton").show();
       // $("#nextButton").show();
        $(".artwork_container").css({ visibility: "visible" });
        $("#overlay2").fadeIn(300);
    
        const output = document.getElementById("outputImage");
        const departmentId = departmentMap[this.title];
        const query = getRandomLetter();
    
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&q=${query}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                objectIDs = data.objectIDs || [];
                console.log(objectIDs);
                currentIndex = 0;
                fetchAndDisplayImage();
            });
    });
});


/*$(document).ready(function(){
    const label = document.getElementById("labelText");

    $("#label").click(function(e){
       
        e.stopPropagation();
        const $label = $(this);
    
        if (labelClicked) return;
    
        // Only store original position once
        if (!originalRect) {
            const rect = this.getBoundingClientRect();
            originalRect = {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };
        }
    
        // Set fixed positioning using saved rect
        $label.css({
            position: "fixed",
            top: originalRect.top + "px",
            left: originalRect.left + "px",
            width: originalRect.width + "px",
            height: originalRect.height + "px"
        });
    
        // Show overlay behind
        $("#overlay").fadeIn(300);
    
        // Animate to center
        setTimeout(() => {
            $label.css({
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1.5)",
            });
        }, 10);
    
        // Add metadata
        label.innerHTML += "<br />" + `Artist: ${artistName}` + "<br />" + `Date: ${period}`;
        labelClicked = true;
    });
    $("#label").hover(function(){
        if(!labelClicked){
            $(this).css("transform", "scale(1.1)");
        }
        }, 
        function(){
            if(!labelClicked){
                $(this).css("transform", "scale(1)");
            }
      });

    $(document).click(function(){
        if (labelClicked) {
            $("#overlay").fadeOut(300);
            label.innerHTML = title;
            labelClicked = false;
    
            $("#label").css({
                position: "relative",
                top: "0",
                left: "0",
                transform: "none",
                width: "",
                height: ""
            });
            //originalRect = null;
        }
    });
   
});*/

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

function fetchAndDisplayImage() {
    if (currentIndex >= objectIDs.length) {
        alert("No more images.");
        return;
    }

    const output = document.getElementById("outputImage");
    const id = objectIDs[currentIndex];
    console.log(`fetching : ${id}`);

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data2 => {
            if (data2.primaryImageSmall) {
                $("#overlay2").fadeOut(300);
                output.src = data2.primaryImageSmall;

                artistName = data2.artistDisplayName || "Unknown";
                period = data2.objectDate;
                title = data2.title;
                document.getElementById("labelText").innerHTML = title;
            } else {
                currentIndex++;
                fetchAndDisplayImage(); // Skip and try next
            }
        })
        .catch(error => console.error(error));
}

$(document).ready(function(){
    $("#nextButton").click(function () {
        currentIndex++;
        fetchAndDisplayImage();
    });
});



/*Debug functions

function clicked(department){
    console.log(`clicked ${department}`);
    
}


window.onload = function(){
    document.getElementById("modern").onmouseenter = function(){clicked("hello");}
}*/