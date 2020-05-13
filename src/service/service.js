'use strict';

const {Cli} = require(`./cli`);

const {ExitCode} = require(`../constants`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX
} = require(`./service-constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand, userInputValue] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(userInputValue);
