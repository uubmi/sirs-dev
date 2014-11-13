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

var riskObsResultsTest = new Array( // sirs risk
    new ObservationResult("386725007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","38.5","20110305110000"),
    new ObservationResult("364075005","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","91","20110305110000"),
    new ObservationResult("86290005","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","33","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","12.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.15","20110305110000")
);

function runCheck (oberservationResultsArray) {
	//will receive pre-transformed patient data
	//first check for missing data
	
	function checkForMissing(patientData) {
		//rule encoded for checking for existence of values for each SIRS criteria
		var missingSirsCriteria = {assessmentPlan :
			{minRequirement: 1, 
				rules : new Array (
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "386725007", "doesExist", "decimal", 0), // Body temperature must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "364075005", "doesExist", "decimal", 0) // Heart rate must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (    
					new Rule("2.16.840.1.113883.6.5", "86290005", "doesExist", "decimal", 0),  // Respiratory rate must exist
					new Rule("2.16.840.1.113883.6.5", "386725007", "doesExist", "decimal", 0)  // PaCO2 < 32(mmHg) must exist
					)
				},
				{minRequirement: 1, 
					rules : new Array (   
						new Rule("2.16.840.1.113883.6.5", "365630000", "doesExist", "decimal", 0),  // Whole white blood cell count must exist 
						new Rule("2.16.840.1.113883.6.5", "442113000", "doesExist", "decimal", 0)  // Immature neutrophil count must exist
					)
				}
				)
			},
			actions : "missing SIRS criteria"
		};  
		
		return assessRules(patientData, missingSirsCriteria["assessmentPlan"], 0 );
		//will send {nMetCriteria: ?, metObs: metObsResults}
	}
	
	var missingData = checkForMissing(oberservationResultsArray);

	if (missingData.nMetCriteria == 0) { //if nothing is missing just ask for SIRS criteria check and send result
		SIRScriteriaMessage = function buildSIRScriteriaMessage {
			//send SIRS Criteria observation message to relevant knowledge execution engine
			
			var knowledgeExecutionEngineResult = assessRules(patientData, sirsCriteria["assessmentPlan"], 0 );
			//will contain nMetCriteria:1 if SIRS criteria met and metObs with all the met observations
			
			//bundle result into message
			//SIRS_criteriaChecker.js is responsible for making a message that the EHR can understand
			return {"SIRS":knowledgeExecutionEngineResult};
		};
		return SIRScriteriaMessage;
	} //if missingData.none
	else { //if missing data then use dummy data to see if SIRS met and report both missing and if SIRS criteria met
		// what about single criteria met? with other values missing ??
		 
		//insert dummy values
		var patientData_withDummyValues = function () {
			var nonRiskValues = { // no sirs risk
				"386725007":"386725007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000",
				new ObservationResult("364075005","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","89","20110305110000"),
				new ObservationResult("86290005","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","19","20110305110000"),
				new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
				new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
				new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.05","20110305110000")
			};
			for (var i = 0, obs; obs = missingData.metObs[i++]; ) {
							console.log("  !! old observation!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"][		"value"] );
				for (var j = 0; j>= oberservationResultsArray.length; j++;) {
					if (obs["observationFocus"]["code"] == oberservationResultsArray[j]["observationFocus"]["code"]) {
						//replace with dummy nonRiskValue
						var key = oberservationResultsArray[j]["observationFocus"]["code"];
						oberservationResultsArray[j] = new ObservationResult(nonRiskValues[code]);
					}
				}
				else {
					
				}
				console.log("  !! new observation!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"][		"value"] );
			} 
		}
		
		//run execution engine with dummy values for missing
		var knowledgeExecutionEngineResult = assessRules(patientData_withDummyValues, sirsCriteria["assessmentPlan"], 0 );
		//will contain nMetCriteria:1 if SIRS criteria met and metObs with all the met observations
		//WILL NEED TO REPORT if SIRS Criteria is met!
		
		missingDataMessage = function (missingData) {
			//message as object with missingData
			return {"SIRS":knowledgeExecutionEngineResult, "missingData":missingData};
		};
		return missingDataMessage;
	}

} //runCheck