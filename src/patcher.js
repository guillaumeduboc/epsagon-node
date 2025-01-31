/**
 * @fileoverview Patcher for all the libraries we are instrumenting
 * IMPORTANT: when requiring this module, all of the libraries will be automatically patched!
 */
const config = require('./config.js');
const utils = require('./utils.js');
const awsSDKPatcher = require('./events/aws_sdk.js');
const awsSDKv3Patcher = require('./events/aws_sdk_v3.js');
const daxPatcher = require('./events/amazon_dax_client.js');
const httpPatcher = require('./events/http.js');
const http2Patcher = require('./events/http2.js');
const pgPatcher = require('./events/pg.js');
const mysqlPatcher = require('./events/mysql.js');
const openWhiskPatcher = require('./events/openwhisk.js');
const googlePatcher = require('./events/google_cloud.js');
const redisPatcher = require('./events/redis.js');
const ioredisPatcher = require('./events/ioredis.js');
const memcachedPatcher = require('./events/memcached.js');
const mongoPatcher = require('./events/mongodb.js');
const dnsPatcher = require('./events/dns.js');
const natsPatcher = require('./events/nats.js');
const mqttPatcher = require('./events/mqtt.js');
const kafkajsPatcher = require('./events/kafkajs.js');
const kafkaNodePatcher = require('./events/kafka-node.js');
const bunyanPatcher = require('./events/bunyan.js');
const pinoPatcher = require('./events/pino.js');
const azureSdkPatcher = require('./events/azure_sdk.js');
const winstonCloudwatchPatcher = require('./events/winston_cloudwatch.js');
const winstonPatcher = require('./events/winston.js');
const amqplibPatcher = require('./events/amqplib.js');
const amqpPatcher = require('./events/amqp.js');
const ldapPatcher = require('./events/ldap.js');
const cassandraPatcher = require('./events/cassandra-driver.js');
const tencentCOSPatcher = require('./events/tencent-cos.js');
const neo4jPatcher = require('./events/neo4j.js');

const fs = require('./events/fs.js');


const LIBNAME_TO_PATCHER = {
    'aws-sdk/global': awsSDKPatcher,
    'aws-sdk/client-sns': awsSDKv3Patcher,
    'azure-sdk': azureSdkPatcher,
    'winston-cw': winstonCloudwatchPatcher,
    'cos-nodejs-sdk-v5': tencentCOSPatcher,
    http: httpPatcher,
    http2: http2Patcher,
    pg: pgPatcher,
    mysql: mysqlPatcher,
    redis: redisPatcher,
    ioredis: ioredisPatcher,
    memcached: memcachedPatcher,
    mongo: mongoPatcher,
    dax: daxPatcher,
    openwhisk: openWhiskPatcher,
    google: googlePatcher,
    dns: dnsPatcher,
    nats: natsPatcher,
    myqq: mqttPatcher,
    kafkajs: kafkajsPatcher,
    kafkanode: kafkaNodePatcher,
    bunyan: bunyanPatcher,
    pino: pinoPatcher,
    winston: winstonPatcher,
    amqplib: amqplibPatcher,
    amqp: amqpPatcher,
    ldap: ldapPatcher,
    cassandra: cassandraPatcher,
    neo4j: neo4jPatcher,
    fs,
};

/**
 * Patches a module
 * @param {Object} patcher module
 */
function patch(patcher) {
    try {
        patcher.init();
    } catch (error) {
        if ((process.env.EPSAGON_DEBUG || '').toUpperCase() === 'TRUE') {
            utils.debugLog('error initiating patch', error);
        }
    }
}

if (!config.getConfig().isEpsagonPatchDisabled) {
    if (!config.getConfig().patchWhitelist) {
        [
            awsSDKPatcher,
            awsSDKv3Patcher,
            httpPatcher,
            http2Patcher,
            pgPatcher,
            mysqlPatcher,
            redisPatcher,
            ioredisPatcher,
            memcachedPatcher,
            mongoPatcher,
            daxPatcher,
            openWhiskPatcher,
            googlePatcher,
            dnsPatcher,
            natsPatcher,
            mqttPatcher,
            kafkajsPatcher,
            kafkaNodePatcher,
            bunyanPatcher,
            pinoPatcher,
            azureSdkPatcher,
            winstonCloudwatchPatcher,
            winstonPatcher,
            amqplibPatcher,
            amqpPatcher,
            ldapPatcher,
            cassandraPatcher,
            tencentCOSPatcher,
            neo4jPatcher,
            fs,
        ].forEach(patch);
    } else {
        config.getConfig().patchWhitelist.forEach(
            (lib) => {
                if (!(LIBNAME_TO_PATCHER[lib])) {
                    utils.debugLog(`[PATCHER] Unable to find lib to patch: ${lib}`);
                } else {
                    utils.debugLog(`[PATCHER] Whitelisting ${lib}`);
                    patch(LIBNAME_TO_PATCHER[lib]);
                }
            }
        );
    }
}
