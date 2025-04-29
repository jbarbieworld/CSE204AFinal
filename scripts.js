
const departmentMap = {
    "egypt" : 10,
    "knights" : 4,
    "africa" : 5, 
    "decorative" : 1,
    "greek" : 13
}

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
        output.src = "";
        document.getElementById("labelText").innerHTML = "";  

        
        
    });
});

$(document).ready(function(){
    $('area').click(function(){
        console.log(this.title)
        $("#map_image").hide();
        const output = document.getElementById("outputImage");
        const departmentId = departmentMap[this.title];
        const query = getRandomLetter();
         fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&q=${query}`)
             .then(response => {
             if (!response.ok) {
                 throw new Error('Network response was not ok');
             }
             return response.json();
             })
             .then(data => {
               let index = 0;
             function fetchImage() {
                 if (index >= data.objectIDs.length || index >= 20) return; 
                 fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${data.objectIDs[index]}`)
                     .then(response => {
                         if (!response.ok) {
                             throw new Error('Network response was not ok');
                         }
                         return response.json();
                     })
                     .then(data2 => {
                         console.log(data2);
                         if (data2.primaryImageSmall) { 
                             output.src = data2.primaryImageSmall; 
                             document.getElementById("labelText").innerHTML = data2.title;  
                             return; 
                         } 
                         index++; 
                         fetchImage(); 
                     })
                     .catch(error => console.error(error));
             }
             fetchImage(); 
           });
        

    });
});


$(document).ready(function(){
    $("#label").click(function(){
        // Show and fade in the background overlay
        $("#overlay").fadeIn(300)
        
        // Animate the div to the center and make it bigger
        $(this).css({
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(1.5)",
        });
    });

    // Optional: click on overlay to reset everything
    $("#overlay").click(function(){
        $("#overlay").fadeOut(300);
        $("#label").css({
            top: "100px",
            left: "100px",
            transform: "none"
        });
    });
});


/*Debug functions

function clicked(department){
    console.log(`clicked ${department}`);
    
}


window.onload = function(){
    document.getElementById("modern").onmouseenter = function(){clicked("hello");}
}*/