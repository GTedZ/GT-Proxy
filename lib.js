const Constants = require('./Constants');

const Meta = require('./Types/Meta');

class Lib {

    isAdmin() {
        try {
            const child_process = require('child_process');
            child_process.execSync('net session', { stdio: 'ignore' });
            return true;
        } catch (err) {
            return false;
        }
    }

    growtopiaReroute(toAttach = true) {
        const fs = require('fs');

        const lines = fs.readFileSync(Constants.hosts_filePath).toString().split('\n');

        if (toAttach) {
            //  Add missing growtopia1 and growtopia2 lines
            const is_growtopia1_present = lines.some(line => line.includes(Constants.growtopia1_domain));
            const is_growtopia2_present = lines.some(line => line.includes(Constants.growtopia2_domain));

            if (!is_growtopia1_present) fs.appendFileSync(Constants.hosts_filePath, `\n127.0.0.1 ${Constants.growtopia1_domain}`);
            if (!is_growtopia2_present) fs.appendFileSync(Constants.hosts_filePath, `\n127.0.0.1 ${Constants.growtopia2_domain}`);
        } else {
            //  Remove missing growtopia1 and growtopia2 lines
            const non_growtopia_lines = lines.filter(line => !line.includes(Constants.growtopia1_domain) && !line.includes(Constants.growtopia2_domain));
            const non_growtopia_str = non_growtopia_lines.join('\n');
            fs.writeFileSync(Constants.hosts_filePath, non_growtopia_str);
        }
    }

    /**
     * @returns {Promise <Meta>}
     */
    async fetch_GT_servers_info() {
        const axios = require('axios');
        const response = await axios(Constants.working_growtopia_server_info_request_URL);
        return new Meta(response.data);
    }

    decodeBase64(base64Text) {
        if (typeof base64Text === 'undefined') throw new Error(`'base64Text' is undefined`);
        if (base64Text === '') return '';
        let buffer = Buffer.from(base64Text, 'base64');
        return buffer.toString('binary');
    }

    makeQueryString(q, sorted = false) {
        let keys = Object.keys(q);
        if (sorted) keys = keys.sort();
        return keys.reduce((a, k) => {
            if (Array.isArray(q[k])) q[k] = JSON.stringify(q[k]);
            if (q[k] !== undefined) {
                a.push(k + "=" + encodeURIComponent(q[k]));
            }
            return a;
        }, [])
            .join("&");
        ;
    }

}

module.exports = new Lib();