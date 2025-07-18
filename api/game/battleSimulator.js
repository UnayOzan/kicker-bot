function simulateBattleTurn(player, enemy, playerAction = "attack", enemyAction = "attack") {
    const minDamage = 5; // sabit min hasar
    const maxHeal = 15; // sabit max iyileme
    const logs = [];

    let playerDamage = 0;
    let enemyDamage = 0;
    let healed = 0;

    // Taş-kağıt-makas ilişkisi
    // attack beats heal, defend beats attack, heal beats defend
    const beats = {
        attack: "heal",
        defend: "attack",
        heal: "defend"
    };

    let summaryLog = `${player.name} chose **${playerAction}**, ${enemy.name} chose **${enemyAction}**. `;

    // Sonuç: win, lose, draw
    let playerResult, enemyResult;

    if (playerAction === enemyAction) {
        playerResult = enemyResult = "draw";
    } else if (beats[playerAction] === enemyAction) {
        playerResult = "win";
        enemyResult = "lose";
    } else {
        playerResult = "lose";
        enemyResult = "win";
    }

    // İşlemleri sadeleştir
    switch (playerAction) {
        case "attack":
            if (playerResult === "win") {
                // Tam hasar vurur
                enemyDamage = minDamage;
                enemy.hp -= enemyDamage;
                // Rakip düşük hasar verir (örneğin 2)
                playerDamage = 2;
                player.stats.hp -= playerDamage;
                summaryLog += `${player.name} dealt ${enemyDamage} damage and received minor counterattack (${playerDamage} damage).`;
            } else if (playerResult === "lose") {
                // Player az hasar alır, düşman tam hasar vurur
                enemyDamage = 2;
                enemy.hp -= enemyDamage;
                playerDamage = minDamage;
                player.stats.hp -= playerDamage;
                summaryLog += `${enemy.name} defended well and dealt ${playerDamage} damage. ${player.name} dealt minimal damage (${enemyDamage}).`;
            } else {
                // Draw: eşit hasar
                enemyDamage = playerDamage = 5;
                enemy.hp -= enemyDamage;
                player.stats.hp -= playerDamage;
                summaryLog += `Both dealt equal damage (${playerDamage}).`;
            }
            break;

        case "defend":
            if (playerResult === "win") {
                // Savunma başarılı, hiç hasar almaz
                playerDamage = 0;
                enemyDamage = 2;
                enemy.hp -= enemyDamage;
                summaryLog += `${player.name} defended successfully and counterattacked for ${enemyDamage} damage.`;
            } else if (playerResult === "lose") {
                // Savunma başarısız, tam hasar alır
                playerDamage = minDamage;
                player.stats.hp -= playerDamage;
                enemyDamage = 0;
                summaryLog += `${player.name} failed to defend and took ${playerDamage} damage.`;
            } else {
                // Draw: az hasar alır
                playerDamage = Math.floor(minDamage / 2);
                player.stats.hp -= playerDamage;
                enemyDamage = 0;
                summaryLog += `${player.name} defended but took minor damage (${playerDamage}).`;
            }
            break;

        case "heal":
            healed = Math.min(maxHeal, getMaxHpForClass(player.class) - player.stats.hp);
            player.stats.hp += healed;
            if (playerResult === "win") {
                enemyDamage = 0;
                playerDamage = 0;
                summaryLog += `${player.name} healed for ${healed} HP safely.`;
            } else if (playerResult === "lose") {
                playerDamage = minDamage;
                player.stats.hp -= playerDamage;
                enemyDamage = 0;
                summaryLog += `${player.name} healed for ${healed} HP but got hit for ${playerDamage} damage during heal.`;
            } else {
                // Draw - healing but slight damage from enemy
                playerDamage = Math.floor(minDamage / 2);
                player.stats.hp -= playerDamage;
                enemyDamage = 0;
                summaryLog += `${player.name} healed for ${healed} HP but received minor damage (${playerDamage}).`;
            }
            break;
    }

    // Sağlık 0 altına düşerse 0 yap
    if (player.stats.hp < 0) player.stats.hp = 0;
    if (enemy.hp < 0) enemy.hp = 0;

    // Kazanan vs kalan can durumu
    if (enemy.hp === 0) summaryLog += ` ${enemy.name} is defeated!`;
    if (player.stats.hp === 0) summaryLog += ` ${player.name} has fallen!`;

    logs.push(summaryLog);

    return {
        playerDamage,
        enemyDamage,
        healed,
        playerDead: player.stats.hp === 0,
        enemyDead: enemy.hp === 0,
        logs,
    };
}

// Max HP sınıflara göre (senin verdiğin)
function getMaxHpForClass(className) {
    const classHp = {
        archer: 80,
        warrior: 120,
        healer: 70,
    };
    return classHp[className] || 100;
}

export default simulateBattleTurn;
