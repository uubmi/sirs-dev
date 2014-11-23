
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
	//console.log(EMRobject.patientData);
	//console.log(EMRobject.clinician); //clinician role is expected

//transformedPatientDataArray is the variable that contains the EMR patient data structured according to our minimal SIRS CDSS information model	
var transformedPatientDataArray = transformPatientData (EMRobject.patientData) ; 

///////FROM HERE ON THE MODEL OF PATIENT AS A SET OF vMR Observations is set///////
//console.log(runCheck(transformedPatientDataArray));
//console.log("did we change EMR?");console.log(EMRobject.patientData);
var sirsResults = new Array( );

sirsResults = runCheck(transformedPatientDataArray);
//console.log("results");
//console.log(sirsResults);
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
	 d3.select("#selectPatientDiv").append("div").attr("id","SCAB").style("color","red").append("h1").text("SIRS Criteria Met"); 
	}
	
	if (EMRobject.clinician.role == "Doctor") {
		//sirsResponse(object,"physician");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.SIRS.metObs.length; i++) {
		d3.select("#"+SNOMEDtoLocalVariableSIRS(sirsResults.SIRS.metObs[i].observationFocus.code)).style("color","red");
	 }
	 d3.select("#selectPatientDiv").append("div").attr("id","SCAB").style("color","red").append("h1").text("SIRS Criteria Met"); 
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
		//console.log(SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code));
		d3.selectAll(locationIs).append("span").attr("class","missingNotice").style("color","green").text(" ?Missing?");
	 }
	 
	}
	
	if (EMRobject.clinician.role == "Doctor") {
	//	sirsResponse(object,"physician");
	 //object updated with response package
	 //actions to be taken are locally determined
	 for(var i = 0; i< sirsResults.missingData.metObs.length; i++) {
		var locationIs = ".choices"+SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code);
		//console.log(SNOMEDtoLocalVariableSIRS(sirsResults.missingData.metObs[i].observationFocus.code));
		d3.selectAll(locationIs).append("span").attr("class","missingNotice").style("color","green").text(" ?Missing?");
	 }
	}
	
  }
}//checkSIRSvalues

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
				new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal",convertLocalEMRnonNumeric(patientData.temperature.value),convertLocalEMReventTime(patientData.temperature.evenTTime)),
				new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal",convertLocalEMRnonNumeric(patientData.heartRate.value),convertLocalEMReventTime(patientData.heartRate.evenTTime)),
				new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal",convertLocalEMRnonNumeric(patientData.respiratoryRate.value),convertLocalEMReventTime(patientData.respiratoryRate.evenTTime)),
				new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal",convertLocalEMRnonNumeric(patientData.PaCO2.value),convertLocalEMReventTime(patientData.PaCO2.evenTTime)),
				new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal",convertLocalEMRnonNumeric(patientData.whiteBloodCellCount.value),convertLocalEMReventTime(patientData.whiteBloodCellCount.evenTTime)),
				new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal",convertLocalEMRnonNumeric(patientData.bandNeutrophilCount.value),convertLocalEMReventTime(patientData.bandNeutrophilCount.evenTTime))
			);
//end Required		

	return sirsObservations;
};//transformPatientData function



checkCriteriaTimer();

//TIMING IS SOMETHING THAT IS LOCALLY CONTROLLED 
//NOT IN THE KNOWLEDGE BASE FOR SIRS CRITERIA
//checking to see if need to update
//patient data 
//check timestamp on observations against current time
//function dataFreshness( oberservationResultsArray, updateInterval) {
//check timestamps for entry with current time to see if updateInterval
function checkCriteriaTimer(pateints) {
	//foreach patinet from pateints 
	//if(updateTimer(patient)) then problem!
	//updateTimer(patientObjectsArray[0]);
	function updateTimer(patientdata){
		var currentTime = convertLocalEMReventTime(new Date);
		var transformedPatientDataArray = transformPatientData(patientdata);
		var resultUpdateCheck = updateChecker(transformedPatientDataArray);
		
		console.log(resultUpdateCheck);
		
	  function updateChecker(patientData) {
		//rule encoded for checking that the interval between checks has not passed
		var adultIntervalToTest = 10; //this is encoded according to the TimeCode Standard in use 
			//20110305110000
			//thus 2 hours would be 20000
			//yearMtDaHrMnSc
		var timingSirsCriteria = {assessmentPlan :
			{minRequirement: 1, 
				rules : new Array (
				{minRequirement: 1, 
					rules : new Array (    //RULES FOR ADULT PATIENTS -- PEDIATRIC AND NEONATES???
					new Rule("2.16.840.1.113883.6.5", "105723007", "lt", "integer", currentTime - adultIntervalToTest), // Body temperature must have entered no more than 2 hours ago
					new Rule("2.16.840.1.113883.6.5", "301113001", "lt", "integer", currentTime - adultIntervalToTest), // Heart rate must have entered no more than 2 hours ago 
					new Rule("2.16.840.1.113883.6.5", "301283003", "lt", "integer", currentTime - adultIntervalToTest),  // Respiratory rate must have entered no more than 2 hours ago
					new Rule("2.16.840.1.113883.6.5", "373677008", "lt", "integer", currentTime - adultIntervalToTest),  // PaCO2 < 32(mmHg) must have entered no more than 2 hours ago
					new Rule("2.16.840.1.113883.6.5", "365630000", "lt", "integer", currentTime - adultIntervalToTest),  // Whole white blood cell count must have entered no more than 2 hours ago 
					new Rule("2.16.840.1.113883.6.5", "442113000", "lt", "integer", currentTime - adultIntervalToTest)  // Immature neutrophil count must have entered no more than 2 hours ago
					)
				}
				//,
				//{minRequirement: 1, 
				//	rules : new Array (    
				//	new Rule("2.16.840.1.113883.6.5", "301113001", "doesNotExist", "decimal", 0) // Heart rate must exist
				//	)
				//},
				//{minRequirement: 1, 
				//	rules : new Array (    
				//	new Rule("2.16.840.1.113883.6.5", "301283003", "doesNotExist", "decimal", 0),  // Respiratory rate must exist
				//	new Rule("2.16.840.1.113883.6.5", "373677008", "doesNotExist", "decimal", 0)  // PaCO2 < 32(mmHg) must exist
				//	)
				//},
				//{minRequirement: 1, 
				//	rules : new Array (   
				//		new Rule("2.16.840.1.113883.6.5", "365630000", "doesNotExist", "decimal", 0),  // Whole white blood cell count must exist 
				//		new Rule("2.16.840.1.113883.6.5", "442113000", "doesNotExist", "decimal", 0)  // Immature neutrophil count must exist
				//	)
				//}
				)
			},
			actions : "checking Timing of SIRS criteria"
		};  	
		return assessTimingRules(patientData, timingSirsCriteria["assessmentPlan"], 0 );
		//will send {nMetCriteria: ?, metObs: metObsResults}
	  }//updateChecker()

		function assessTimingRules(obsResults, assessmentPlan, level) { //execution engine!!!!!
			var criteriaMet = 0;
			var rules = assessmentPlan["rules"];
			var metObsResults = [];
			var assessedResults;
			for(var i = 0, rule; rule = rules[i++];) {
				if ('undefined' !== typeof (rules[0].comparison) ) {  
					for (var k = 0, obs; obs = obsResults[k++];) {
						if (checkTime(obs, rule)) {
		//                    console.log(" criteria met "+rule["code"]+" "+rule["comparison"]+" "+rule["value"]+"("+obs["observationValue"]["value"]+")");
							criteriaMet++;
							metObsResults.push(obs);
						}    
					}
				} else {
					assessedResults = assessTimingRules(obsResults, rule, level+1);
					criteriaMet += assessedResults.nMetCriteria;
					for (var mi = 0, badRes; badRes = assessedResults["metObs"][mi++];) {
						metObsResults.push(badRes);
					}    
				}        
			}
			if (criteriaMet >= assessmentPlan["minRequirement"]) {
		//        console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
				return { 
					nMetCriteria: 1,
					metObs: metObsResults
				};
			} else {
		//        console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
				return { 
					nMetCriteria: 0,
					metObs: metObsResults
				};
			}
		}
		
		function checkTime(obsResult, rule) {
	//contains ability to use a large number of comparisons in addition to missing to allow for customization/flexibility 
	//for cases where a criteria is only needed when another one is missing!
		var returnResult = false; //default is the the rule has not been met
		if (obsResult["observationFocus"]["code"] != rule["code"] 
			|| obsResult["observationFocus"]["codeSystem"] != rule["codeSystem"])
				return returnResult;	
		var value; // = obsResult["observationValue"]["value"];
		switch (rule["valueType"]) {
			case "decimal": value = parseFloat(obsResult["observationEventTime"]["observationEventTime"]);
							break;
			case "integer": value = parseInt(obsResult["observationEventTime"]["observationEventTime"]);
							break;
		}                    
		switch (rule["comparison"]) {
			case "gt": 
				if(value > rule["value"])
					returnResult = true;
				break;
			case "ge": 
				if(value >= rule["value"])
					returnResult = true;
				break;
			case "lt": 
				if(value < rule["value"])
					returnResult = true;
				break;
			case "le": 
				if(value <= rule["value"])
					returnResult = true;
				break;
			case "eq": 
				if(value == rule["value"])
					returnResult = true;
				break;
			case "ne": 
				if(value != rule["value"])
					returnResult = true;
				break;
			case "doesNotExist":
				if(typeof value == 'undefined' || isNaN(value) ){
					returnResult = true;
					break;
				}
				if(obsResult["observationValue"]["value"].length == 0) {
					returnResult = true;
					break;
				}
			break;
		}    
		return returnResult;
	}	  

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


