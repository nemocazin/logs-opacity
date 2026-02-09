# Changelog

## [1.2.0] - 2026-02-09

### Added

- Added opacity adjustment for default VS Code colors ([#11](https://github.com/nemocazin/unobtrusive-logs/issues/11))
- Added toggle command (`unobtrusive-logs.toggle`) to enable/disable the extension ([#10](https://github.com/nemocazin/unobtrusive-logs/issues/10))
- Added support for Go "_.Logs._" statements
- Added general support for "Log" statements ([#8](https://github.com/nemocazin/unobtrusive-logs/issues/8))
- Added create custom regexes command ([#3](https://github.com/nemocazin/unobtrusive-logs/issues/3))
- Added delete custom regexes command ([#3](https://github.com/nemocazin/unobtrusive-logs/issues/3))

### Fixed

- Regular expressions now support multiline log statements ([#9](https://github.com/nemocazin/unobtrusive-logs/issues/9))
- Opacity at 100% no longer resets colors to default

## [1.1.1] - 2025-02-01

### Changed

- Modified the general regex to detect statements with multiple chained function calls (e.g., `log.error("test").format().time();`) ([#6](https://github.com/nemocazin/unobtrusive-logs/issues/6)) ([#7](https://github.com/nemocazin/unobtrusive-logs/issues/7))
- Improved ESLint rules

### Added

- New icon for the extension (Thanks to [@eNiiju](https://github.com/eNiiju)) ([#5](https://github.com/nemocazin/unobtrusive-logs/pull/5))

## [1.1.0] - 2025-01-28

### Changed

- Renamed the command titles from `Logs` to `Unobtrusive Logs` ([#2](https://github.com/nemocazin/unobtrusive-logs/issues/2))

### Added

- Added support for `console.*` methods in JavaScript and TypeScript regexes ([#4](https://github.com/nemocazin/unobtrusive-logs/issues/4))
- Added general regex `log.*` used for every languages
- Added support for C++ logging: `std::cerr.*`, `std::cout.*`, `std::clog.*`, `cerr.*`, `cout.*`, and `clog.*`

## [1.0.1] - 2025-01-25

### Changed

- Renamed the command from `logs-opacity:*` to `unobtrusive-logs:*` ([#1](https://github.com/nemocazin/unobtrusive-logs/issues/1))

## [1.0.0] - 2025-01-25

### Added

- Added command to change color of log statements
- Added command to change opacity of log statements
