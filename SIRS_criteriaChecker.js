
//object is the model of the EHR
//contains

//THIS file contains those things which we specify but need to be modified for each EHR


object.responsePakcage == "";

patientData = { //from EHR form or JSON from 
	"patientID":"value";
	"observation":{};
	"observation":{};
	"observation":{};
	"observation":{}; ....}

oberservationResultsArray = function transformPateintData (patientData) {
//transform the data for sending vMR-esq compliant message to knowledge execution engine NEED to MOVE TO CDS
//this Function is critical and the output is the message we specify
//the implementer of our service will need to modify here to fit their data model
//look through Local EMR patient model to find the applicable data for the SIRS criteria
//note: missing values are checked when running runcheck

//THIS IS TO BE ADAPTED LOCALLY TO SUIT THE PARTICULAR EMR pateint data model!!!
//once this has been run the data is in the expected form - 
//fingers crossed



};
if(runcheck(oberservationResultsArray).criteria == 1) {
	
	if (object.role == "nurse") {
	 sirsResponse(object,"nurse");
	 //object updated with response package
	}
	
	if (object.role == "physician") {
	 sirsResponse(object,"physician");
	 //object updated with response package
	}
	
}

//checking to see if need to update
//patient data 
//check timestamp on observations against current time
function dataFreshness(var oberservationResultsArray,var updateInterval) {
//check timestamps for entry with current time to see if updateInterval
var dataNeedingUpdate = function () { 
	var resultText = "";
	for oberservationResultsArray {
	};
	return resultText;
};
return dataNeedingUpdate; 
}
// !! add timer Independent of data entry!!	


