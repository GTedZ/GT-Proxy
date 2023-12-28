class Meta {

    /** @type {string} */
    server;

    /** @type {number} */
    port;

    /** @type {number} */
    type;

    /** @type {string} */
    beta_server;

    /** @type {number} */
    beta_port;

    /** @type {number} */
    beta_type;

    /** @type {string} */
    beta2_server;

    /** @type {number} */
    beta2_port;

    /** @type {number} */
    beta2_type;

    /** @type {string} */
    beta3_server;

    /** @type {number} */
    beta3_port;

    /** @type {number} */
    beta3_type;

    /** @type {number} */
    type2;

    /** @type {string} */
    meta;

    /** @type {string} */
    meta2;

    /** @type {string} */
    raw_str;

    /**
     * @param {string} response_str
     */
    constructor(response_str) {
        const lines = response_str.split('\n');
        const this_keys = Object.keys(this);
        for (let line of lines) {
            let [key, value] = line.split('|');

            if (typeof value === 'undefined') this.meta2 = key;
            else {
                if (isNumber(value)) value = parseFloat(value);

                if (this_keys.includes(key)) this[key] = value;
            }

        }

        this.raw_str = response_str;
    }

}

/**
 * @param {string} str 
 */
function isNumber(str) {

    const length = str.length;

    const number = parseFloat(str);
    if (isNaN(number) || number.toString().length !== length) return false;

    return true;

}

module.exports = Meta;