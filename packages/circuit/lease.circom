pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

// Calculate credit rating of Lessee 

template compareLimits()
{
	signal input value;
	signal input min;
	signal input max;
	signal output out;
	
	component compareMin = GreaterEqThan(16);
	compareMin.in[0] <== value;
	compareMin.in[1] <== min;
	
	component compareMax = GreaterEqThan(16);
	compareMax.in[0] <== value;
	compareMax.in[1] <== max;
 
	out <== compareMin.out + compareMax.out;
}

template lease() 
{
 // information about Lessee
 signal input roothash; 	// roothash of SMT holding input signals
 signal input address;		// Ethereum address of Lessee
 signal input time;			// time of lessee input generation
 
 signal input creditScore;  // creditScore
 var creditScoreLimits[2] = [650,800];
 signal creditScoreRating;
 
 signal input licenseAge;   // medical license age, full years
 var licenseAgeLimits[2] = [2,5];
 var licenseAgeRating;
 
 signal input ownFacility;  // own facility where equipment will be installed, must be 0 or 1;
 ownFacility * (ownFacility - 1) === 0; // check that ownFacility is 0 or 1
 
 signal input debtLevel;
 var debtLevelLimits[2] = [60,70];
 signal debtLevelRating;
 
 signal output rating;

 component compareRootHash = IsZero();
 compareRootHash.in <== roothash;
 compareRootHash.out === 0;
 
 component compareAddress = IsZero();
 compareAddress.in <== address;
 compareAddress.out === 0;
 
 component compareTime = IsZero();
 compareTime.in <== time;
 compareTime.out === 0;

 component compareCreditScore = compareLimits();
 compareCreditScore.value <== creditScore;
 compareCreditScore.min   <== creditScoreLimits[0];
 compareCreditScore.max   <== creditScoreLimits[1];
 log(compareCreditScore.out);
 
 component compareLicenseAge = compareLimits();
 compareLicenseAge.value <== licenseAge;
 compareLicenseAge.min   <== licenseAgeLimits[0];
 compareLicenseAge.max   <== licenseAgeLimits[1];
 log(compareLicenseAge.out);
 
 component compareDebtLevel = compareLimits();
 compareDebtLevel.value <== debtLevel;
 compareDebtLevel.min   <== debtLevelLimits[0];
 compareDebtLevel.max   <== debtLevelLimits[1];
 log(compareDebtLevel.out);
 
 rating <== compareCreditScore.out + compareLicenseAge.out + compareDebtLevel.out + ownFacility; 
 log(rating);
 
}

component main {public [roothash, address, time]} = lease();
