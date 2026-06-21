# Changelog

## [1.4.0] - 2026-06-21

### Added

- Added detection of logs with chained methods

### Changed

- Improved pattern detection accuracy

## [1.3.0] - 2026-04-17

### Changed

- Replaced the "regex" keyword by the "pattern" keyword
- Removed regex-based logic and replaced it with a parenthesis matching approach to ensure all log sentences are detected

### Fixed

- General patterns are now applied to all languages

## [1.2.0] - 2026-02-09

### Added

- Added opacity adjustment for default VS Code colors ([#11](https://github.com/nemocazin/unobtrusive-logs/issues/11))
- Added toggle command (`unobtrusive-logs.toggle`) to enable/disable the extension ([#10](https://github.com/nemocazin/unobtrusive-logs/issues/10))
- Added support for Go "_.Logs._" statements
- Added general support for "Log" statements ([#8](https://github.com/nemocazin/unobtrusive-logs/issues/8))
- Added create custom patterns command ([#3](https://github.com/nemocazin/unobtrusive-logs/issues/3))
- Added delete custom patterns command ([#3](https://github.com/nemocazin/unobtrusive-logs/issues/3))

### Fixed

- Regular expressions now support multiline log statements ([#9](https://github.com/nemocazin/unobtrusive-logs/issues/9))
- Opacity at 100% no longer resets colors to default

## [1.1.1] - 2025-02-01

### Changed

- Modified the general pattern to detect statements with multiple chained function calls (e.g., `log.error("test").format().time();`) ([#6](https://github.com/nemocazin/unobtrusive-logs/issues/6)) ([#7](https://github.com/nemocazin/unobtrusive-logs/issues/7))
- Improved ESLint rules

### Added

- New icon for the extension (Thanks to [@eNiiju](https://github.com/eNiiju)) ([#5](https://github.com/nemocazin/unobtrusive-logs/pull/5))

## [1.1.0] - 2025-01-28

### Changed

- Renamed the command titles from `Logs` to `Unobtrusive Logs` ([#2](https://github.com/nemocazin/unobtrusive-logs/issues/2))

### Added

- Added support for `console.*` methods in JavaScript and TypeScript patterns ([#4](https://github.com/nemocazin/unobtrusive-logs/issues/4))
- Added general pattern `log.*` used for every languages
- Added support for C++ logging: `std::cerr.*`, `std::cout.*`, `std::clog.*`, `cerr.*`, `cout.*`, and `clog.*`

## [1.0.1] - 2025-01-25

### Changed

- Renamed the command from `logs-opacity:*` to `unobtrusive-logs:*` ([#1](https://github.com/nemocazin/unobtrusive-logs/issues/1))

## [1.0.0] - 2025-01-25

### Added

- Added command to change color of log statements
- Added command to change opacity of log statements
