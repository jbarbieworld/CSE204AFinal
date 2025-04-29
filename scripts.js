
const departmentMap = {
    "egypt" : 10,
    "knights" : 4,
    "africa" : 5, 
    "decorative" : 12,
    "greek" : 13,
    "american" : 1,
    "photos" : 9,
    "islamic": 14,
    "asian": 6
}

let artistName = "";
let title = "";
let period = "";
let labelClicked = false;
let originalRect = null;
let objectIDs = [];
let usedLetters = [];
let currentIndex = 0;


let queryLetters = "abcdefghijlmnoprstuw"




 //Back button handling
$(document).ready(function(){
    $("#backButton").click(function(){
        const output = document.getElementById("outputImage");
        $("#map_image").show();
        $("#backButton").hide();
        $("#nextButton").hide();
        $("#label").css({
            visibility: "hidden"
        });
        $(".artwork_container").css({
            visibility: "hidden"
        });

        output.src = "";
        const label = document.getElementById("labelText");
        label.innerHTML = "";

        
        
    });
});

//Next button handling
$(document).ready(function(){
    $("#nextButton").click(function () {
        currentIndex++;
        $("#overlay2").fadeIn(300);
        fetchAndDisplayImage();
    });
});


//Image map handling -- fetches first image
$(document).ready(function(){
    $('area').click(function () {
        console.log(this.title);
        $("#map_image").hide();
        $("#backButton").show();
        $("#nextButton").show();
        $("#label").css({
            visibility: "visible"
        });
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
               // console.log(objectIDs);
                currentIndex = 0;
                fetchAndDisplayImage();
            });
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
    // Pre-expand once invisibly to stabilize layout
    const $label = $("#label");

    // Save original styles
    const originalStyles = {
        position: $label.css("position"),
        top: $label.css("top"),
        left: $label.css("left"),
        transform: $label.css("transform"),
        visibility: $label.css("visibility")
    };

    // Apply expanded state invisibly
    $label.css({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(1.5)",
        visibility: "hidden"
    });

    // Force layout calculation
    $label[0].offsetHeight;

    // Restore original styles
    $label.css(originalStyles);
});

//function to fetch images -- requests until artwork with available image is found
function fetchAndDisplayImage() {
    if (currentIndex >= objectIDs.length) {
        alert("No more images.");
        return;
    }

    const output = document.getElementById("outputImage");
    const id = objectIDs[currentIndex];
   // console.log(`fetching : ${id}`);

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

//function to choose random letter for search query, meaning each "revisit" to a gallery yeilds different artworks
function getRandomLetter(){
    const randomInd = Math.floor(Math.random() * queryLetters.length);
    console.log(queryLetters);
    console.log(`removing: ${queryLetters.charAt(randomInd)}`)
    let char = queryLetters.charAt(randomInd);
    queryLetters = queryLetters.replace(char,"");
    if(queryLetters.length == 0){
        queryLetters = "abcdefghijlmnoprstuw";
    }
    return char;
    
}




/*Debug functions

function clicked(department){
    console.log(`clicked ${department}`);
    
}


window.onload = function(){
    document.getElementById("modern").onmouseenter = function(){clicked("hello");}
}*/