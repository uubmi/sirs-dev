
var ObservationFocus = function (code, codeSystem, codeSystemName, displayName) {
    this.code = code;
    this.codeSystem = codeSystem;
    this.codeSystemName = codeSystemName;
    this.displayName = displayName;
}

var ObservationValue = function (valueType, value) {
    this.valueType = valueType;
    this.value = value;
}

var ObservationEventTime = function (time) {
    this.observationEventTime = time;
}
var ObservationResult = function(code, codeSystem, codeSystemName, displayName, valueType, value, time) {
    this.observationFocus = new ObservationFocus(code, codeSystem, codeSystemName, displayName);
    this.observationValue = new ObservationValue(valueType,value);
    this.observationEventTime = new ObservationEventTime(time);
}

//THIS file contains those things which we specify but need to be modified for each EHR
function checkSIRSvalues (EMRobject) {
//EMR object contains {"patientData":d,"clinician":currentClinician}
//The specification is loose here as the exact nature of the incoming object is not known
//Must be tailored to local EMR
	console.log(EMRobject.patientData);
	console.log(EMRobject.clinician); //clinician role is expected

//transformedPatientDataArray is the variable that contains the EMR patient data structured according to our minimal SIRS CDSS information model	
var transformedPatientDataArray = transformPatientData (EMRobject.patientData) ; 

//critical function! to convert from local EMR patient information model to the SIRS EMR independent CDSS information model
function transformPatientData (patientData) {
//transform the data for sending vMR-esq compliant message to knowledge execution engine NEED to MOVE TO CDS
//this Function is critical and the output is the message we specify
//the implementer of our service will need to modify here to fit their data model
//look through Local EMR patient model to find the applicable data for the SIRS criteria
//note: missing values are checked when running runcheck
//THIS IS TO BE ADAPTED LOCALLY TO SUIT THE PARTICULAR EMR patient data model!!!
//once this has been run the data is in the expected form - 
//fingers crossed
//OUR CDSS is agnostic to the EHR patient model
//THIS FUNCTION IS WHERE THE EHR Patient information model is fit to the model used by our CDSS
//HERE IS WHERE WE SPECIFIY THAT local custom changes will be needed

//validating the values in the EMR data model based on local specifications 
	//For example EMR specific non-numeric value handling
	//within our demo EMR 'default' is used for a value
	
	//var temperature = EMRobject.patientData.temperature;
	//var heartRate = EMRobject.patientData.heartRate;
	//var respiratoryRate = EMRobject.patientData.respiratoryRate;
	//var PaCO2 = EMRobject.patientData.PaCO2;
	//var whiteBloodCellCount = EMRobject.patientData.whiteBloodCellCount;
	//var bandNeutrophilCount = EMRobject.patientData.bandNeutrophilCount;
	
	function convertLocalEMRnonNumeric(dataElement) {
//console.log("making "+dataElement+"");
		if (dataElement == 'default'){
			return ""; //change!
		} 
		if (typeof dataElement == 'undefined' || isNaN(dataElement)) { //If your local EMR model does not have one of the Criteria but you wish to still use this CDSS, then alter the code here
			console.log("EMR DOES NOT CONTAIN ALL ELEMENTS FOR SIRS CRITERIA");
			alert("CRITICAL ERROR! CONTACT SUPPORT IMMEDIATELY!! EMR INFORMATION MODEL IS NOT APPROPRIATE FOR SIRS CRITERIA DETERMINATION!! DOES NOT CONTAIN ALL ELEMENTS FOR SIRS CRITERIA!!");
			//consider emailing Local CDSS maintenance team!
			return "ERROR";
		}
		return dataElement; //if not changed
		
	}
//example for Event Time
//this is also used for the Timer functions: see checkCriteriaTimer
	function convertLocalEMReventTime (dataElement) {
//console.log(dataElement);
		if(dataElement != 0) {//send the data as a vMR compliant string
			return dataElement.getFullYear()+""+(dataElement.getMonth()+1)+""+dataElement.getDate()+""+dataElement.getHours()+""+dataElement.getMinutes()+""+dataElement.getSeconds();
		} 
		if (typeof dataElement == 'undefined' || isNaN(dataElement)) { //If your local EMR model does not have one of the Criteria but you wish to still use this CDSS, then alter the code here
			console.log("EMR DOES NOT CONTAIN TIME ELEMENT");
			//alert("ERROR! CONTACT SUPPORT! EMR DOES NOT CONTAIN TIME ELEMENT");
			//consider emailing Local CDSS maintenance team!
			return "ERROR";
		}
		return 0; //if time is zero then no time has been assigned
	}
	
//Required:
//values inserted into pre-configured compliant structure
			var sirsObservations = new Array ( 
				new ObservationResult("386725007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal",convertLocalEMRnonNumeric(patientData.temperature.value),convertLocalEMReventTime(patientData.temperature.evenTTime)),
				new ObservationResult("364075005","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal",convertLocalEMRnonNumeric(patientData.heartRate.value),convertLocalEMReventTime(patientData.heartRate.evenTTime)),
				new ObservationResult("86290005","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal",convertLocalEMRnonNumeric(patientData.respiratoryRate.value),convertLocalEMReventTime(patientData.respiratoryRate.evenTTime)),
				new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal",convertLocalEMRnonNumeric(patientData.PaCO2.value),convertLocalEMReventTime(patientData.PaCO2.evenTTime)),
				new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal",convertLocalEMRnonNumeric(patientData.whiteBloodCellCount.value),convertLocalEMReventTime(patientData.whiteBloodCellCount.evenTTime)),
				new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal",convertLocalEMRnonNumeric(patientData.bandNeutrophilCount.value),convertLocalEMReventTime(patientData.bandNeutrophilCount.evenTTime))
			);
//end Required		

	return sirsObservations;
};

console.log("sending");console.log(transformedPatientDataArray);
//////FROM HERE ON THE MODEL OF PATIENT AS A SET OF vMR Observations is set///////
console.log(runCheck(transformedPatientDataArray));
//console.log("did we change EMR?");console.log(EMRobject.patientData);
var sirsResults = new Array( );

sirsResults = runCheck(transformedPatientDataArray);
console.log("results");
console.log(sirsResults);
if(sirsResults.SIRS.nMetCriteria == 1) { //SIRS criteria met
	console.log("sirs met");
	
	//SNOMEDtoLocalVariableSIRS(observationFocus.code)
	//gives which EMR variable to indicate
	
	if (EMRobject.clinician.role == "Nurse") {
	//sirsResponse(object,"nurse");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.SIRS.metObs.length; i++) {
		d3.select("#"+SNOMEDtoLocalVariableSIRS(sirsResults.SIRS.metObs[i].observationFocus.code)).style("color","red");
	 }
	 d3.select("#selectPatientDiv").append("div").attr("id","SCAB").style("color","yellow").text("SIRS Criteria Met"); 
	}
	
	if (EMRobject.clinician.role == "Doctor") {
		//sirsResponse(object,"physician");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.SIRS.metObs.length; i++) {
		d3.select("#"+SNOMEDtoLocalVariableSIRS(sirsResults.SIRS.metObs[i].observationFocus.code)).style("color","orange");
	 }
	 d3.select("#selectPatientDiv").append("div").attr("id","SCAB").style("color","yellow").append("h1").text("SIRS Criteria Met"); 
	}
	
}

  if(sirsResults.missingData.nMetCriteria == 1) { //missing SIRS criteria
	console.log("missing data");
	if (EMRobject.clinician.role == "Nurse") {
	//sirsResponse(object,"nurse");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.missingData.metObs.length; i++) {
		var locationIs = ".choices"+SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code);
		console.log(SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code));
		d3.selectAll(locationIs).append("span").attr("class","missingNotice").style("color","blue").text(" ?Missing?");
	 }
	 
	}
	
	if (EMRobject.clinician.role == "Doctor") {
	//	sirsResponse(object,"physician");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.missingData.metObs.length; i++) {
		var locationIs = ".choices"+SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code);
		console.log(SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code));
		d3.selectAll(locationIs).append("span").attr("class","missingNotice").style("color","green").text(" ?Missing?");
	 }
	}
	
  }
}//checkSIRSvalues

//TIMING IS SOMETHING THAT IS LOCALLY CONTROLLED 
//NOT IN THE KNOWLEDGE BASE FOR SIRS CRITERIA
//checking to see if need to update
//patient data 
//check timestamp on observations against current time
//function dataFreshness( oberservationResultsArray, updateInterval) {
//check timestamps for entry with current time to see if updateInterval
function checkCriteriaTimer() {
	
function updateTimer(transformedPatientDataArray){
var currentTime = convertLocalEMReventTime(new Date);

function checkForMissing( patientData) {
		//rule encoded for checking for existence of values for each SIRS criteria
		//existence is here operationally defined as present with SNOMED-CT code and a value
		var missingSirsCriteria = {assessmentPlan :
			{minRequirement: 1, 
				rules : new Array (
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "386725007", "doesNotExist", "decimal", 0) // Body temperature must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "364075005", "doesNotExist", "decimal", 0) // Heart rate must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "86290005", "doesNotExist", "decimal", 0),  // Respiratory rate must exist
					new Rule("2.16.840.1.113883.6.5", "373677008", "doesNotExist", "decimal", 0)  // PaCO2 < 32(mmHg) must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (   
						new Rule("2.16.840.1.113883.6.5", "365630000", "doesNotExist", "decimal", 0),  // Whole white blood cell count must exist 
						new Rule("2.16.840.1.113883.6.5", "442113000", "doesNotExist", "decimal", 0)  // Immature neutrophil count must exist
					)
				}
				)
			},
			actions : "missing SIRS criteria"
		};  	
		return assessMissing(patientData, missingSirsCriteria["assessmentPlan"], 0 );
		//will send {nMetCriteria: ?, metObs: metObsResults}
}


//then iterate through and check 
var dataNeedingUpdate = function () { 
	var resultText = "";
	//for oberservationResultsArray {
	//};
	return resultText;
};
//return dataNeedingUpdate; 
//}
// !! add timer Independent of data entry!!	
}
}

