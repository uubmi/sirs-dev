
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

var oberservationResultsArray = transformPateintData (EMRobject.patientData) ;
function transformPateintData (patientData) {
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

//values inserted into pre-configured compliant structure
			var sirsObservations = new Array ( 
				new ObservationResult("386725007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal",EMRobject.patientData.temperature,"20110305110000"),
				new ObservationResult("364075005","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal",EMRobject.patientData.heartRate,"20110305110000"),
				new ObservationResult("86290005","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal",EMRobject.patientData.respiratoryRate,"20110305110000"),
				new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal",EMRobject.patientData.PaCO2,"20110305110000"),
				new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal",EMRobject.patientData.whiteBloodCellCount,"20110305110000"),
				new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal",EMRobject.patientData.bandNeutrophilCount,"20110305110000")
			);
	return sirsObservations;
};

console.log(oberservationResultsArray);

//////FROM HERE ON THE MODEL OF PATIENT AS A SET OF vMR Observations is set///////
console.log(runCheck(oberservationResultsArray));
//if(runCheck(oberservationResultsArray).criteria == 1) {
	
	//if (object.role == "nurse") {
	// sirsResponse(object,"nurse");
	 //object updated with response package
	//}
	
	//if (object.role == "physician") {
	// sirsResponse(object,"physician");
	 //object updated with response package
	//}
	
//}

//checking to see if need to update
//patient data 
//check timestamp on observations against current time
//function dataFreshness( oberservationResultsArray, updateInterval) {
//check timestamps for entry with current time to see if updateInterval
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

