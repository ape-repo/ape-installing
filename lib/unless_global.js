/**
 * Install module unless global exists.
 * @function unlessGlobal
 * @param {string} name - Name to install
 * @param {object} [options] - Optional settings.
 * @param {string} [options.cwd=process.cwd()] - Working directory path.
 * @param {string} [options.bin=name] - Name of bin.
 * @param {boolean} [options.save=false] - Save to package.json
 * @param {boolean} [options.saveDev=false] - Save as dev to package.json
 * @param {boolean} [options.global=false] - Save as global module.
 * @param {boolean} [options.exit] - Exit when done.
 * @param {function} callback - Callback when done.
 */

"use strict";

const argx = require('argx'),
    hasbin = require('hasbin'),
    done = require('./done'),
    colorprint = require('colorprint'),
    execcli = require('execcli');

/** @lends unlessGlobal */
function unlessGlobal(name, options, callback) {
    let args = argx(arguments);
    callback = args.pop('function');
    options = args.pop('object') || {};
    name = args.shift('string');

    let logger = colorprint.create({
        PREFIX: '[ape-installing]: '
    });

    function _done(err) {
        if (options.exit) {
            done(err);
        } else {
            callback(err);
        }
    }

    let bin = options.bin || name;
    hasbin(bin, (has) => {
        if (has) {
            _done(null);
            logger.debug('`%s` is already installed. ', bin);
            return;
        }
        logger.debug('Installing `%s`... ', bin);
        unlessGlobal.npm(['install', name, {
            save: options.save,
            saveDev: options.saveDev,
            global: options.global
        }], (err) => {
            _done(err);
        });
    });
}

unlessGlobal.npm = function (args, callback) {
    execcli('npm', args, callback);
};


module.exports = unlessGlobal;