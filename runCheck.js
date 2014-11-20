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

function copyObservationResult(parentCopy){	
	var code = parentCopy.observationFocus.code;
	var codeSystem = parentCopy.observationFocus.codeSystem;
	var codeSystemName = parentCopy.observationFocus.codeSystemName;
	var displayName = parentCopy.observationFocus.displayName;
	var valueType = parentCopy.observationValue.valueType;
	var value = parentCopy.observationValue.value;
	var observationEventTime = parentCopy.observationEventTime.observationEventTime;
	return new ObservationResult(
	code,
	codeSystem,
	codeSystemName,
	displayName,
	valueType,
	value,
	observationEventTime
	);
}

var missingObsResultsTest = new Array( // sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","38.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","91","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","33","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","12.1","20110305110000")
	//,
    //new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","","20110305110000")
	//new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.15","20110305110000")
);

//runCheck(missingObsResultsTest);
//console.log(missingObsResultsTest);

function runCheck (oberservationResultsArray) {
	//will receive pre-transformed patient data
	//first check for missing data
	var missingData = checkForMissing(oberservationResultsArray);

	//for (var i = 0, obs; obs = missingData.metObs[i++]; ) {
        //console.log("  !! warning observation!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"]["value"] );
	//} 
	
	if (missingData.nMetCriteria == 0) { //if nothing is missing just ask for SIRS criteria check and send result
		SIRScriteriaMessage = buildSIRScriteriaMessage(oberservationResultsArray);
		function buildSIRScriteriaMessage (oberservationResultsArray){
			//send SIRS Criteria observation message to relevant knowledge execution engine
			var knowledgeExecutionEngineResult = assessRules(oberservationResultsArray, sirsCriteria["assessmentPlan"], 0 );
			//will contain nMetCriteria:1 if SIRS criteria met and metObs with all the met observations

			//for (var i = 0, obs; obs = knowledgeExecutionEngineResult.metObs[i++]; ) {
				//console.log("  !!Oh No!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"]["value"] );
			//}	 
			//bundle result into message
			//SIRS_criteriaChecker.js is responsible for making a message that the EHR can understand
			return {"SIRS":knowledgeExecutionEngineResult, "missingData":missingData};
		};
		return SIRScriteriaMessage;
	} //if missingData.none
	else { 
	//if missing data then use dummy data to see if SIRS met and report both missing and if SIRS criteria met
	//no need to look for criteria that is missing completely as it will also be given a dummy value for SIRS crieria determination
	
		// what about single criteria met? with other values missing ??
		 console.log("  !! missing data !!" );
		 
		//insert dummy values
		var patientData_withDummyValues = addDummyData(oberservationResultsArray,missingData);
		function addDummyData (oberservationResultsArray,missingData) {
			var nonRiskValues = { // no sirs risk
				"105723007":new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000"),
				"301113001":new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","89","20110305110000"),
				"301283003":new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","19","20110305110000"),
				"373677008":new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
				"365630000":new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
				"442113000":new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.05","20110305110000")
			};

			//copy values from oberservationResultsArray to dummyOberservationResultsArray
			var dummyOberservationResultsArray = new Array ();
			for(var i = 0; i < oberservationResultsArray.length; i++){
				dummyOberservationResultsArray[i] = copyObservationResult(oberservationResultsArray[i]);
			}
			//code that could be used to check codesystem as well...
			//if (obsResult["observationFocus"]["code"] != obsToCheck["code"] 
			//	|| obsResult["observationFocus"]["codeSystem"] != obsToCheck["codeSystem"])
			
			//now put in dummy values for criteria that is missing a value	
			for (var i = 0, obs; obs = missingData.metObs[i++]; ) {
				//console.log("  !! old observation!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"][		"value"] );
				for (var j = 0, obsToCheck; obsToCheck = dummyOberservationResultsArray[j++];) {
					if (obs["observationFocus"]["code"] == dummyOberservationResultsArray[j-1]["observationFocus"]["code"]) {
						//replace with dummy nonRiskValue
						var code = dummyOberservationResultsArray[j-1]["observationFocus"]["code"];
						dummyOberservationResultsArray[j-1] = nonRiskValues[code];
					}
				}
			}
			return dummyOberservationResultsArray;
		}
		//run execution engine with dummy values for missing
		//IMPORTANT NOT TO SUBISTUTE THE patientData_withDummyValues for Real patient data even if they are missing
		var knowledgeExecutionEngineResult = assessRules(patientData_withDummyValues, sirsCriteria["assessmentPlan"], 0 );
		//will contain nMetCriteria:1 if SIRS criteria met and metObs with all the met observations
		//WILL NEED TO REPORT if SIRS Criteria is met!
		missingDataMessage = {
			//message as object with missingData
			"SIRS":knowledgeExecutionEngineResult, "missingData":missingData
		};
		return missingDataMessage;
	}
} //runCheck


function checkForMissing( patientData) {
		//rule encoded for checking for existence of values for each SIRS criteria
		//existence is here operationally defined as present with SNOMED-CT code and a value
		var missingSirsCriteria = {assessmentPlan :
			{minRequirement: 1, 
				rules : new Array (
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "105723007", "doesNotExist", "decimal", 0) // Body temperature must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "301113001", "doesNotExist", "decimal", 0) // Heart rate must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "301283003", "doesNotExist", "decimal", 0),  // Respiratory rate must exist
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


function assessMissing(obsResults, assessmentPlan, level) {
    var criteriaMet = 0;
    var rules = assessmentPlan["rules"];
    var metObsResults = [];
	var completelyMissingResults = [];
    var assessedResults;
    for(var i = 0, rule; rule = rules[i++];) {
        if ('undefined' !== typeof (rules[0].comparison) ) { //tells us if we are not at an executable rule level
			var numNonApplicableCriteria = 0;
            for (var k = 0, obs; obs = obsResults[k++];) { 
			//console.log(" checking "+rule["code"]+" "+rule["comparison"]+" "+rule["value"]+"("+obs["observationFocus"]["code"]+")");
			//console.log(" criteria met "+rule["code"]+" "+rule["comparison"]+" "+rule["value"]+"("+obs["observationValue"]["value"]+")");
                if (checkMissing(obs, rule)) {
 //                   console.log(" criteria met "+rule["code"]+" "+rule["comparison"]+" "+rule["value"]+"("+obs["observationValue"]["value"]+")");
                    criteriaMet++;
                    metObsResults.push(obs);
                }
				else { //keep track of number criteria that did not have the correct code
					if (obs["observationFocus"]["code"] != rule["code"] 
								|| obs["observationFocus"]["codeSystem"] != rule["codeSystem"])
						numNonApplicableCriteria++;	
				}
            }
			//CRITICAL this only fires off when a rule does not have an applicable observation in the observation array
			if (numNonApplicableCriteria == obsResults.length) { //then the criteria for the Rule is not Present at all!
				//console.log("ouch! "+rule["code"]+" "+rule["comparison"]+"");
				criteriaMet++; //counts as missingData
				var blankValues = { // blank Values to substitute for completely not included data 
				"105723007":new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","","20110305110000"),
				"301113001":new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","","20110305110000"),
				"301283003":new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","","20110305110000"),
				"373677008":new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","","20110305110000"),
				"365630000":new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","","20110305110000"),
				"442113000":new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","","20110305110000")
				};
				var subsitituteForMissing = blankValues[rule["code"]]; 
				//console.log(""+blankValues[rule["code"]]+" from "+rule["code"]+"");
				//console.log(blankValues[rule["code"]]);

				
				//console.log(""+blankValues[rule["code"]]+" from "+rule["code"]+"");
				metObsResults.push(copyObservationResult(subsitituteForMissing));
				completelyMissingResults.push(copyObservationResult(subsitituteForMissing));
			}
        } else { //if we were not yet at an executable rule level then go deeper
            assessedResults = assessMissing(obsResults, rule, level+1);
            criteriaMet += assessedResults.nMetCriteria;
            for (var mi = 0, badRes; badRes = assessedResults["metObs"][mi++];) {
                metObsResults.push(badRes);
            }
			for (var mi = 0, badRes; badRes = assessedResults["completelyMissing"][mi++];) {
                completelyMissingResults.push(badRes);
            }
        }        
    }
    if (criteriaMet >= assessmentPlan["minRequirement"]) {
     //  console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
        return { 
            nMetCriteria: 1,
            metObs: metObsResults,
			completelyMissing: completelyMissingResults, 
        };
    } else {
       // console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
        return { 
            nMetCriteria: 0,
            metObs: metObsResults,
			completelyMissing: completelyMissingResults,
        };
    }
}

function checkMissing(obsResult, rule) {
//contains ability to use a large number of comparisons in addition to missing to allow for customization/flexibility 
//for cases where a criteria is only needed when another one is missing!
    var returnResult = false; //default is the the rule has not been met
    if (obsResult["observationFocus"]["code"] != rule["code"] 
        || obsResult["observationFocus"]["codeSystem"] != rule["codeSystem"])
            return returnResult;	
    var value; // = obsResult["observationValue"]["value"];
    switch (rule["valueType"]) {
        case "decimal": value = parseFloat(obsResult["observationValue"]["value"]);
                        break;
        case "integer": value = parseInt(obsResult["observationValue"]["value"]);
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
    }    
    return returnResult;
}