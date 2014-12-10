//
var tempVmr = '<?xml version="1.0" encoding="UTF-8"?> <vmr:vmr xsi:schemaLocation="org.opencds.vmr.v1_0.schema.vmr vmr.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vmr="org.opencds.vmr.v1_0.schema.vmr"> <!-- ALL: 18 years old, female, EncDx (ICD9CM): pregnancy,sexual activity; procedures (CPT/HCPCS/UBREV): sexual activity, chlamydia tests, pregnancy Tests; Obs (LOINC): chlamydia tests, pregnancy Tests, sexual activity; SubstanceAdmin (NDC): contraceptives--> <templateId root="2.16.840.1.113883.3.1829.11.1.2.1"/> <patient> <templateId root="2.16.840.1.113883.3.1829.11.2.1.1"/> <id extension="CHL0001" root="2.16.840.1.113883.3.795.5.2.1.1"/> <demographics> </demographics> <clinicalStatements> <observationResults> <observationResult><!--Observation temperature test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="105723007" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName="Body temperature (observable entity)"/> <observationEventTime high="20110305110000" low="20110305110000"/> <observationValue><decimal value="38.5"/></observationValue> </observationResult> <observationResult><!--Observation heart rate test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="301113001" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName="Heart rate (observable entity)"/> <observationEventTime high="20110305110000" low="20110305110000"/> <observationValue><decimal value="91"/></observationValue> </observationResult> <observationResult><!--Observation respiratory rate test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="301283003" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName="Respiratory rate (observable entity)"/> <observationEventTime high="20110305110000" low="20110305110000"/> <observationValue><decimal value="21"/></observationValue> </observationResult> <observationResult><!--Observation PCO2 test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="373677008" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName="Finding of arterial partial pressure of carbon dioxide (finding)"/> <observationEventTime high="20110305110000" low="20110305110000"/> <observationValue><decimal value="33"/></observationValue> </observationResult> <observationResult><!--Observation whole white blood cell count test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="365630000" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName="Finding of white blood cell number (finding)"/> <observationEventTime high="20110305120000" low="20110305120000"/> <observationValue><decimal value="12.1"/></observationValue> </observationResult> <observationResult><!--Observation immature neutrophil test--> <id extension="obr002" root="2.16.840.1.113883.3.795.5.2.3.6"/> <observationFocus code="442113000" codeSystem="2.16.840.1.113883.6.5" codeSystemName="SNOMED-CT" displayName=" Band neutrophil count above reference range (finding)"/> <observationEventTime high="20110305120000" low="20110305120000"/> <observationValue><decimal value="0.15"/></observationValue> </observationResult> </observationResults> </clinicalStatements> </patient></vmr:vmr>';


/*
 * return a xmlDocument
 */
function xmlDocu(vmr) {
    var xmlDoc = $.parseXML( xml );
    var $xml = $( xmlDoc );
    return $xml;
} 

function add(x, y) {
    return x+y
}

function getObsValue(xml, code) {
    var $obsVals = xml.find( "observationResults" );    
    for (i = 0; i < $obsVals.size(); i++) {
        i;
    }
}

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
var riskObsResults = new Array( // sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","38.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","91","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","33","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","12.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.15","20110305110000")
);
var nonriskObsResults = new Array( // no sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","89","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","19","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.05","20110305110000")
);
var lowriskObsResults = new Array( // sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","89","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.05","20110305110000")
);
var medriskObsResults = new Array( // sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","91","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.05","20110305110000")
);
var med2riskObsResults = new Array( // sirs risk
    new ObservationResult("105723007","2.16.840.1.113883.6.5","SNOMED-CT","Body temperature","decimal","37.5","20110305110000"),
    new ObservationResult("301113001","2.16.840.1.113883.6.5","SNOMED-CT","Heart rate","decimal","89","20110305110000"),
    new ObservationResult("301283003","2.16.840.1.113883.6.5","SNOMED-CT","Respiratory rate","decimal","21","20110305110000"),
    new ObservationResult("373677008","2.16.840.1.113883.6.5","SNOMED-CT","PaCO2","decimal","23","20110305110000"),
    new ObservationResult("365630000","2.16.840.1.113883.6.5","SNOMED-CT","WBC count","decimal","10.1","20110305110000"),
    new ObservationResult("442113000","2.16.840.1.113883.6.5","SNOMED-CT","Band neutrophil count","decimal","0.15","20110305110000")
);
var Rule = function (codeSystem, code, comparison, valueType, value) {
    this.codeSystem = codeSystem;
    this.code = code;
    this.comparison = comparison;
    this.valueType = valueType;
    this.value = value;
}

var checkTempUpperBound = new Rule("2.16.840.1.113883.6.5", "105723007", "gt", "decimal", 38); // Body temperature > 38(C)  
var checkTempLowerBound = new Rule("2.16.840.1.113883.6.5", "105723007", "lt", "decimal", 36);  // Body temperature < 36(C) 
var sirsCriterion1 = {minRequirement: 1, rules : new Array (checkTempUpperBound, checkTempLowerBound)};

var sirsCriterion2 = new Rule("2.16.840.1.113883.6.5", "301113001", "gt", "decimal", 90); // Heart rate > 90(beats/min)  

var checkRRUpperBound = new Rule("2.16.840.1.113883.6.5", "301283003", "gt", "decimal", 20);     // Respiratory rate > 20 (breaths/min)
var checkPaCO2LowerBound = new Rule("2.16.840.1.113883.6.5", "373677008", "lt", "decimal", 32);  // PaCO2 < 32(mmHg)  
var sirsCriterion3 = {minRequirement: 1, rules : new Array (checkRRUpperBound, checkPaCO2LowerBound)};

var checkWBCUpperBound = new Rule("2.16.840.1.113883.6.5", "365630000", "gt", "decimal", 12);  // Whole white blood cell count > 12.0(x10^9/L)
var checkWBCLowerBound = new Rule("2.16.840.1.113883.6.5", "365630000", "lt", "decimal", 4);   // Whole white blood cell count < 4.0(x10^9/L) 
var checkWBC = {minRequirement: 1, rules : new Array (checkWBCUpperBound, checkWBCLowerBound)};
var checkBandsUpperBound = new Rule("2.16.840.1.113883.6.5", "442113000", "gt", "decimal", 0.1);  // Immature neutrophil count > 0.10(fraction)
var sirsCriterion4 = {minRequirement: 1, rules : new Array (checkWBC, checkBandsUpperBound)};

var sirsCriteria =  //knowledge representation!!!!!
{minRequirement: 2, 
 rules : new Array (sirsCriterion1, sirsCriterion2, sirsCriterion3, sirsCriterion4),
 actionsWhenMet : [ "sirs risk", "Measure lactate level", "Order blood cultures"],
 actionsNotMet : ["not sirs risk"]
};    


var sirsCriteria_original =  //knowledge representation!!!!!
{minRequirement: 2, 
 rules : new Array (
    {minRequirement: 1, 
     rules : new Array (    
        new Rule("2.16.840.1.113883.6.5", "105723007", "gt", "decimal", 38), // Body temperature > 38(C)  {codeSystem : "2.16.840.1.113883.6.5", code : "105723007", comparison: "gt", valueType: "decimal", value: 38}
        new Rule("2.16.840.1.113883.6.5", "105723007", "lt", "decimal", 36)  // Body temperature < 36(C)  {codeSystem : "2.16.840.1.113883.6.5", code : "105723007", comparison: "lt", valueType: "decimal", value: 36} 
     )
    },
        new Rule("2.16.840.1.113883.6.5", "301113001", "gt", "decimal", 90) // Heart rate > 90(beats/min)  {codeSystem : "2.16.840.1.113883.6.5", code : "301113001", comparison: "gt", valueType: "decimal", value: 90}
     ,
    {minRequirement: 1, 
     rules : new Array (    
        new Rule("2.16.840.1.113883.6.5", "301283003", "gt", "decimal", 20),  // Respiratory rate > 20 (breaths/min)   {codeSystem : "2.16.840.1.113883.6.5", code : "301283003", comparison: "gt", valueType: "decimal", value: 20}
        new Rule("2.16.840.1.113883.6.5", "373677008", "lt", "decimal", 32)  // PaCO2 < 32(mmHg)             {codeSystem : "2.16.840.1.113883.6.5", code : "105723007", comparison: "lt", valueType: "decimal", value: 32}
     )
    },
    {minRequirement: 1, 
     rules : new Array (   
        {minRequirement: 1, 
         rules : new Array (   
            new Rule("2.16.840.1.113883.6.5", "365630000", "gt", "decimal", 12),  // Whole white blood cell count > 12.0(x10^9/L)  {codeSystem : "2.16.840.1.113883.6.5", code : "365630000", comparison: "gt", valueType: "decimal", value: 12}
            new Rule("2.16.840.1.113883.6.5", "365630000", "lt", "decimal", 4)  // Whole white blood cell count < 4.0(x10^9/L)    {codeSystem : "2.16.840.1.113883.6.5", code : "365630000", comparison: "lt", valueType: "decimal", value: 4}
         )},
        new Rule("2.16.840.1.113883.6.5", "442113000", "gt", "decimal", 0.1)  // Immature neutrophil count > 0.10(fraction)    {codeSystem : "2.16.840.1.113883.6.5", code : "442113000", comparison: "gt", valueType: "decimal", value: 0.1}
     )
    }
 ),
actionsWhenMet : [ "sirs risk", "Measure lactate level", "Order blood cultures"],
actionsNotMet : ["not sirs risk"]
};    
function assessRules(obsResults, assessmentPlan, level) { //execution engine!!!!!
    var criteriaMet = 0;
    var rules = assessmentPlan["rules"];
    var metObsResults = [];
    var actions = [];
    var assessedResults;
    for(var i = 0, rule; rule = rules[i++];) {          //  each rule in a complex rules
        if ('undefined' !== typeof (rule.comparison) ) {    // if rule is a simple rule
            for (var k = 0, obs; obs = obsResults[k++];) {
                if (checkRule(obs, rule)) {
//                    console.log(" criteria met "+rule["code"]+" "+rule["comparison"]+" "+rule["value"]+"("+obs["observationValue"]["value"]+")");
                    criteriaMet++;
                    metObsResults.push(obs);
                }    
            }
        } else {                                            // rule is also complex rule
            assessedResults = assessRules(obsResults, rule, level+1);
            criteriaMet += assessedResults.nMetCriteria;
            for (var mi = 0, badRes; badRes = assessedResults["metObs"][mi++];) {
                metObsResults.push(badRes);
            }    
            for (var iAction = 0, action; action = assessedResults["actionsToTake"][iAction++]; ) {
                actions.push(action);
            }
        }        
    }
    if (criteriaMet >= assessmentPlan["minRequirement"]) {
//        console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
        if ('undefined' !== typeof (assessmentPlan.actionsWhenMet)) {
            for (var iActionMet = 0, actionMet; actionMet = assessmentPlan["actionsWhenMet"][iActionMet++]; ) {
                actions.push(actionMet);
            }
        }
        return { 
            nMetCriteria: 1,
            metObs: metObsResults,
            actionsToTake: actions 
        };
    } else {
//        console.log("level "+level+", criteria met: "+criteriaMet+" minReq: " + assessmentPlan["minRequirement"]);
        if ('undefined' !== typeof (assessmentPlan.actionsNotMet)) {
            for (var iActionNotMet = 0, actionNotMet; actionNotMet = assessmentPlan["actionsNotMet"][iActionNotMet++]; ) {
                actions.push(actionNotMet);
            }
        }
        return { 
            nMetCriteria: 0,
            metObs: metObsResults,
            actionsToTake: actions
        };
    }
}

function checkRule(obsResult, rule) { //execution engine guts!!!!!
    var returnResult = false; //default is the the rule has not been met
	//check to see if the rule is applicable to the obsResult
    if (obsResult["observationFocus"]["code"] != rule["code"] 
        || obsResult["observationFocus"]["codeSystem"] != rule["codeSystem"])
            return returnResult;
    var value;
    switch (rule["valueType"]) { //changing string to number
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
		//case "doesNotExist":
		//	if((typeof value == 'undefined') || (obsResult["observationValue"]["value"].length == 0)) 
			//this is going to trigger SIRS criteria when the observation is empty, so I commented it out
			//the local CDS is responsible for weather or not the data meets the specifications of the knowledge resource!
		//		returnResult = true;
		//	break;
    }    
    return returnResult;
}

function testSIRS(obss) {
    for (var i = 0, obs; obs = obss[i++]; ) {
        console.log("Observations -- "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"]["value"] );
    }    
    var res = assessRules(obss, sirsCriteria, 0 );
    console.log ("nMetCriteria: "+res.nMetCriteria);
    console.log ("metObs length: "+res.metObs.length);
    for (var i = 0, obs; obs = res.metObs[i++]; ) {
        console.log("  !! warning observation!! "+obs["observationFocus"]["displayName"]+": "+obs["observationValue"]["value"] );
    }    
    console.log ("actions length: "+res.actionsToTake.length);
    for (var i = 0, action; action = res.actionsToTake[i++]; ) {
        console.log("  !! Take actions !! "+action );
    }    
} 

var patients = [riskObsResults, nonriskObsResults, lowriskObsResults, medriskObsResults, med2riskObsResults];
for (var i = 0, pat; pat = patients[i++];) {
   // console.log("assessing patient #"+i);
   // testSIRS(pat);
}

//console.log(checkRule("37",sirsCriteria["assessments"]["assessments"][0]["rules"][0]))
var tempRule = new Rule("2.16.840.1.113883.6.5",  "105723007",  "gt",  "decimal", 38);
//tempRule = {codeSystem : "2.16.840.1.113883.6.5", code : "365630000", comparison: "gt", valueType: "decimal", value: 12};
//console.log("assess rules for risk patient: "+assessRules(riskObsResults, sirsCriteria, 0 ).nMetCriteria);
//console.log("assess rules for non risk patient: "+assessRules(nonriskObsResults, sirsCriteria, 0 ).nMetCriteria);
//console.log("assess rules for low risk patient: "+assessRules(lowriskObsResults, sirsCriteria, 0 ).nMetCriteria);
//console.log("assess rules for med risk patient: "+assessRules(medriskObsResults, sirsCriteria, 0 ).nMetCriteria);
//console.log("assess rules for med risk patient2: "+assessRules(med2riskObsResults, sirsCriteria, 0 ).nMetCriteria);

console.log("test end");
//console.log(tempRule)
//console.log(tempRule instanceof Rule)
//console.log(new Rule("2.16.840.1.113883.6.5",  "105723007",  "gt",  "decimal", 38))
//console.log(sirsCriteria["assessments"]["assessments"][0]["rules"] instanceof Array)
//console.log(new Rule("2.16.840.1.113883.6.5",  "105723007",  "gt",  "decimal", 38) == sirsCriteria["assessments"]["assessments"][0]["rules"][0])
