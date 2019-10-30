function init(){
  document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
function handleFileSelect(event){
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
  console.log(event);
  document.getElementById('csv').textContent = event.target.result;
} 
var importedCSV;
        var exotics;
        function importCSV() {
            let csv = document.getElementById('csv').value;
            let aCSV = csv.split('\n').map(armourPiece => armourPiece.split(',')).map(armourPieceArray => {
                let returnArray = {
                    Name: armourPieceArray[0],
                    Exotic: armourPieceArray[4].includes('Exotic'),
                    Type: armourPieceArray[5],
                    Class: armourPieceArray[7],
                    Element: armourPieceArray[9],
                    Mobility: 1 * armourPieceArray[19],
                    Recovery: 1 * armourPieceArray[20],
                    Resilience: 1 * armourPieceArray[21],
                    Intelligence: 1 * armourPieceArray[22],
                    Discipline: 1 * armourPieceArray[23],
                    Strength: 1 * armourPieceArray[24],
                    Total: 1 * armourPieceArray[25]
                }
                switch (armourPieceArray[27]) {
                    case 'Mobility Mod*': returnArray.Mobility += -10
                        break;
                    case 'Recovery Mod*': returnArray.Recovery += -10
                        break;
                    case 'Resilience Mod*': returnArray.Resilience += -10
                        break;
                    case 'Intellect Mod*': returnArray.Intelligence += -10
                        break;
                    case 'Discipline Mod*': returnArray.Discipline += -10
                        break;
                    case 'Strength Mod*': returnArray.Strength += -10
                        break;
                    default:
                        break;
                }
                return returnArray
            }).filter(armourPiece => armourPiece.Element.includes('Capacity'))
            importedCSV = aCSV;
            let charClass = document.getElementById('class').value;
            importedCSV = importedCSV.filter(armourPiece => armourPiece.Class === charClass);
            exotics = importedCSV.filter(piece => piece.Exotic);
            populateOptionsDropDowns(exotics);
            toggleShowHide()
        }
        function populateOptionsDropDowns(exotics) {
            exotics.forEach(exotic => {
                let newSelect = document.createElement('option');
                let selectHTML = "<option value='" + exotic.Name + "'>" + exotic.Name + "</option>";
                newSelect.innerHTML = selectHTML;
                document.getElementById('selectedExotic').add(newSelect);
            })
        }
        function toggleShowHide() {
            document.getElementById('postImport').classList.remove('hide');
            document.getElementById('preImport').classList.add('hide');
        }
        function evaluateLoadout() {
            let selectedExotic = document.getElementById('selectedExotic').value;
            let headEle = document.getElementById('headEle').value;
            let armEle = document.getElementById('armEle').value;
            let chestEle = document.getElementById('chestEle').value;
            let legEle = document.getElementById('legEle').value;
            let masterworkClass = document.getElementById('masterworkClass').value;
            let sorter = document.getElementById('Pstat').value;
            let secondarySorter = document.getElementById('Sstat').value;
            let armourForClass = importedCSV
            let Head = armourForClass.filter(armourPiece => armourPiece.Type === "Helmet").filter(helmet => helmet.Element.includes(headEle) || headEle === 'Any').filter((armourPiece, index, array) => {
                let exoticInSlot = array.find(armourPiece => armourPiece.Name === selectedExotic)
                if (exoticInSlot) {
                    return armourPiece.Name === selectedExotic
                }
                return true
            })
            let Arms = armourForClass.filter(armourPiece => armourPiece.Type === "Gauntlets").filter(arm => arm.Element.includes(armEle) || armEle === 'Any').filter((armourPiece, index, array) => {
                let exoticInSlot = array.find(armourPiece => armourPiece.Name === selectedExotic)
                if (exoticInSlot) {
                    return armourPiece.Name === selectedExotic
                }
                return true
            })
            let Chest = armourForClass.filter(armourPiece => armourPiece.Type === "Chest Armor").filter(chest => chest.Element.includes(chestEle) || chestEle === 'Any').filter((armourPiece, index, array) => {
                let exoticInSlot = array.find(armourPiece => armourPiece.Name === selectedExotic)
                if (exoticInSlot) {
                    return armourPiece.Name === selectedExotic
                }
                return true
            })
            let Legs = armourForClass.filter(armourPiece => armourPiece.Type === "Leg Armor").filter(legs => legs.Element.includes(legEle) || legEle === 'Any').filter((armourPiece, index, array) => {
                let exoticInSlot = array.find(armourPiece => armourPiece.Name === selectedExotic)
                if (exoticInSlot) {
                    return armourPiece.Name === selectedExotic
                }
                return true
            })
            let allCombinations = []
            Head.forEach(head => {
                Arms.forEach(arms => {
                    if (head.Exotic + arms.Exotic <= 1) 
                        Chest.forEach(chest => {
                            if (head.Exotic + arms.Exotic + chest.Exotic <= 1) 
                                Legs.forEach(legs => {
                                    if (head.Exotic + arms.Exotic + chest.Exotic + legs.Exotic <= 1) {
                                      let masterworkClassModifier = 0
                                      if(masterworkClass === 'Yes'){
                                        masterworkClassModifier = 2;
                                      }
                                        let thisCombo = {
                                            head: armourPieceIdentifier(head),
                                            arms: armourPieceIdentifier(arms),
                                            chest: armourPieceIdentifier(chest),
                                            legs: armourPieceIdentifier(legs),
                                            Mobility: Math.floor(
                                                (head.Mobility + arms.Mobility + chest.Mobility + legs.Mobility + masterworkClassModifier) / 10
                                            ),
                                            Recovery: Math.floor(
                                                (head.Recovery + arms.Recovery + chest.Recovery + legs.Recovery + masterworkClassModifier) / 10
                                            ),
                                            Resilience: Math.floor(
                                                (head.Resilience + arms.Resilience + chest.Resilience + legs.Resilience + masterworkClassModifier) / 10
                                            ),
                                            Intelligence: Math.floor(
                                                (head.Intelligence + arms.Intelligence + chest.Intelligence + legs.Intelligence + masterworkClassModifier) / 10
                                            ),
                                            Discipline: Math.floor(
                                                (head.Discipline + arms.Discipline + chest.Discipline + legs.Discipline + masterworkClassModifier) / 10
                                            ),
                                            Strength: Math.floor(
                                                (head.Strength + arms.Strength + chest.Strength + legs.Strength + masterworkClassModifier) / 10
                                            )
                                        }
                                        thisCombo.Total = thisCombo.Mobility + thisCombo.Recovery + thisCombo.Resilience + thisCombo.Intelligence + thisCombo.Discipline + thisCombo.Strength;
                                        if (thisCombo.Total >= 20 || thisCombo.Mobility >= 6 || thisCombo.Recovery >= 6 || thisCombo.Resilience >= 6 || thisCombo.Intelligence >= 6 || thisCombo.Discipline >= 6 || thisCombo.Strength >= 6) {
                                            allCombinations.push(thisCombo)
                                        }
                                    }
                                })
                        })
                })
            });
            allCombinations = allCombinations.sort((a, b) => (a[sorter] > b[sorter]) ? -1 : 1)
            topStat = allCombinations[0][sorter]
            let topCombinations = allCombinations.filter(combo => combo[sorter] === topStat);
            let finalCombinations;
            if (topCombinations.length < 20) {
                finalCombinations = [].concat(topCombinations.sort((a, b) => (a[secondarySorter] > b[secondarySorter]) ? -1 : 1), allCombinations.filter(combo => combo[sorter] === topStat - 1).sort((a, b) => (a[secondarySorter] > b[secondarySorter]) ? -1 : 1))
            } else {
                finalCombinations = topCombinations.sort((a, b) => (a[secondarySorter] > b[secondarySorter]) ? -1 : 1);
            }
            console.log(finalCombinations)
            populateResults(finalCombinations)
        }
        function armourPieceIdentifier(armourPiece) {
            return {name: armourPiece.Name, statTotal: armourPiece.Total, element: armourPiece.Element}
        }
        function populateResults(results) {
            document.getElementById('Result').innerHTML = ''
            let HeaderRow = document.createElement('tr')
            let Discipline = document.createElement('th')
            Discipline.innerHTML = 'Discipline'
            let Intelligence = document.createElement('th')
            Intelligence.innerHTML = 'Intelligence'
            let Mobility = document.createElement('th')
            Mobility.innerHTML = 'Mobility'
            let Recovery = document.createElement('th')
            Recovery.innerHTML = 'Recovery'
            let Resilience = document.createElement('th')
            Resilience.innerHTML = 'Resilience'
            let Strength = document.createElement('th')
            Strength.innerHTML = 'Strength'
            let Total = document.createElement('th')
            Total.innerHTML = 'Total'
            let Head = document.createElement('th')
            Head.innerHTML = 'Head'
            let Chest = document.createElement('th')
            Chest.innerHTML = 'Chest'
            let Gauntlets = document.createElement('th')
            Gauntlets.innerHTML = 'Gauntlets'
            let Legs = document.createElement('th')
            Legs.innerHTML = 'Legs'
            HeaderRow.appendChild(Total)
            HeaderRow.appendChild(Mobility)
            HeaderRow.appendChild(Resilience)
            HeaderRow.appendChild(Recovery)
            HeaderRow.appendChild(Discipline)
            HeaderRow.appendChild(Intelligence)
            HeaderRow.appendChild(Strength)
            HeaderRow.appendChild(Head)
            HeaderRow.appendChild(Gauntlets)
            HeaderRow.appendChild(Chest)
            HeaderRow.appendChild(Legs)
            document.getElementById('Result').appendChild(HeaderRow);
            results.forEach(result => {
                let HeaderRow = document.createElement('tr')
                let Discipline = document.createElement('td')
                Discipline.innerHTML = result.Discipline
                let Intelligence = document.createElement('td')
                Intelligence.innerHTML = result.Intelligence
                let Mobility = document.createElement('td')
                Mobility.innerHTML = result.Mobility
                let Recovery = document.createElement('td')
                Recovery.innerHTML = result.Recovery
                let Resilience = document.createElement('td')
                Resilience.innerHTML = result.Resilience
                let Strength = document.createElement('td')
                Strength.innerHTML = result.Strength
                let Total = document.createElement('td')
                Total.innerHTML = result.Total
                let Head = document.createElement('td')
                Head.innerHTML = `${
                    result.head.name
                } (${
                    result.head.element.split(' ')[0]
                }, ${
                    result.head.statTotal
                })`;
                let Chest = document.createElement('td')
                Chest.innerHTML = `${
                    result.chest.name
                } (${
                    result.chest.element.split(' ')[0]
                }, ${
                    result.chest.statTotal
                })`;
                let Gauntlets = document.createElement('td')
                Gauntlets.innerHTML = `${
                    result.arms.name
                } (${
                    result.arms.element.split(' ')[0]
                }, ${
                    result.arms.statTotal
                })`;
                let Legs = document.createElement('td')
                Legs.innerHTML = `${
                    result.legs.name
                } (${
                    result.legs.element.split(' ')[0]
                }, ${
                    result.legs.statTotal
                })`;
                HeaderRow.appendChild(Total)
                HeaderRow.appendChild(Mobility)
                HeaderRow.appendChild(Resilience)
                HeaderRow.appendChild(Recovery)
                HeaderRow.appendChild(Discipline)
                HeaderRow.appendChild(Intelligence)
                HeaderRow.appendChild(Strength)
                HeaderRow.appendChild(Head)
                HeaderRow.appendChild(Gauntlets)
                HeaderRow.appendChild(Chest)
                HeaderRow.appendChild(Legs)
                document.getElementById('Result').appendChild(HeaderRow);
            })
        }
