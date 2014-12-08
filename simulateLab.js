var labTests = ['whiteBloodCellCount', 'bandNeutrophilCount'];

// !! add timer Independent of data entry!!	
function simulateLab(patientIndex, labTestIndex, testValue) {
    disableLabValueMutation();
    console.log("simulateLab");
//    var patientIndex = Math.floor((Math.random() * patientObjectsArray.length));
    console.log("simulateLab "+patientIndex+" "+labTestIndex+" "+testValue);
    var patientID = patientObjectsArray[patientIndex].id;
//        var labTestIndex = Math.floor((Math.random() * labTests.length));
    var labTestElement;
    var labTestName;
    var labTestUnit;
    if (labTestIndex == 0) {
        labTestElement = document.getElementById("whiteBloodCellCount");
        labTestName = "White Blood Cell Count";
        labTestUnit = "x10^9/L";
    } else if (labTestIndex == 1) {
        labTestElement = document.getElementById("bandNeutrophilCount");
        labTestName = "Immature Neutrophil fraction";
        labTestUnit = "";
    }
    console.log("simulateLab "+labTestElement+" "+labTestName+" "+labTestUnit);
    var patientNames = d3.select('#selectPatients').node(); //orient to select that has patient names
    var patientSelectedIndex = patientNames.selectedIndex; //get value of the option which has been currently selected
    console.log("simulateLab patientSelectedIndex:"+patientSelectedIndex);

    //transformedPatientDataArray is the variable that contains the EMR patient data structured according to our minimal SIRS CDSS information model	
    var transformedPatientDataArray = transformPatientData (patientObjectsArray[patientIndex]) ; 
	var newEvenTTime = new Date();
    var labTestAttributeName = labTests[labTestIndex];
    patientObjectsArray[patientIndex][labTests[labTestIndex]].value = testValue;
    patientObjectsArray[patientIndex][labTests[labTestIndex]].evenTTime.setTime(newEvenTTime.getTime());
    console.log("simulateLab  patientObjectsArray[patientIndex][labTests[latTestIndex]].value:"+ patientObjectsArray[patientIndex][labTests[labTestIndex]].value);
    if (patientIndex ==  patientSelectedIndex) {
        labTestElement.value = testValue;
        updatePatientData(labTestElement);
        console.log("simulateLab - patientIndex is current");
    } else {
        console.log("simulateLab - patientIndex is NOT current");
        var otherMetSIRS = checkSIRSvalues({"patientData":patientObjectsArray[patientIndex],"clinician":currentClinician,"isCurrentlyViewedPatinet":false});
        console.log("simulatedLab - what returned from checkSIRSvalues:" + otherMetSIRS);
        if (otherMetSIRS == "otherMetSIRS")
           alert("SIRS criteria met!!\n"+patientObjectsArray[patientIndex].name+" received lab: \n"+labTestName+" "+testValue+labTestUnit); 
    }
} // end of simulateLab()


function disableLabValueMutation() {
    for (var i = 0; i < labTests.length; i++) {
        document.getElementById(labTests[i]).readOnly = true;
    }
}