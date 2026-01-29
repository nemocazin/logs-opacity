import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        // Tell the parser how to find the TSConfig for each source file
        // See: https://typescript-eslint.io/getting-started/typed-linting/
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    /* Configuration for all JavaScript and TypeScript files */
    {
        files: ['*.js', '*.mjs', '*.cjs', '*.jsx', '*.ts', '*.mts', '*.cts', '*.tsx'],
        rules: {
            'no-constructor-return': 'error',
            'no-duplicate-imports': [
                'warn',
                {
                    includeExports: true,
                    allowSeparateTypeImports: true,
                },
            ],
            'no-inner-declarations': [
                'error',
                'both',
                {
                    blockScopedFunctions: 'disallow',
                },
            ],
            'no-promise-executor-return': [
                'error',
                {
                    allowVoid: true,
                },
            ],
            'no-template-curly-in-string': 'warn',
            'no-unreachable-loop': 'error',
            'no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    allowNamedExports: false,
                    enums: true,
                    typedefs: true,
                    ignoreTypeReferences: true,
                },
            ],
            'require-atomic-updates': [
                'error',
                {
                    allowProperties: false,
                },
            ],
            'block-scoped-var': 'error',
            'camelcase': [
                'warn',
                {
                    properties: 'always',
                    ignoreDestructuring: false,
                    ignoreImports: false,
                    ignoreGlobals: true,
                },
            ],
            'capitalized-comments': [
                'warn',
                'always',
                {
                    ignoreConsecutiveComments: true,
                    ignoreInlineComments: true,
                },
            ],
            'consistent-return': [
                'error',
                {
                    treatUndefinedAsUnspecified: false,
                },
            ],
            'consistent-this': ['warn', 'that'],
            'curly': ['warn', 'all'],
            'default-case-last': 'error',
            'default-param-last': 'error',
            'dot-notation': 'error',
            'eqeqeq': [
                'error',
                'always',
                {
                    null: 'always',
                },
            ],
            'func-name-matching': [
                'warn',
                'always',
                {
                    considerPropertyDescriptor: false,
                    includeCommonJSModuleExports: false,
                },
            ],
            'func-names': ['warn', 'as-needed'],
            'func-style': [
                'warn',
                'declaration',
                {
                    allowArrowFunctions: true,
                },
            ],
            'max-depth': ['warn', 4],
            'max-nested-callbacks': ['warn', 3],
            'max-params': [
                'warn',
                {
                    max: 5,
                },
            ],
            'new-cap': [
                'error',
                {
                    newIsCap: true,
                    capIsNew: false,
                    properties: true,
                },
            ],
            'no-alert': 'warn',
            'no-array-constructor': 'error',
            'no-caller': 'error',
            'no-else-return': [
                'warn',
                {
                    allowElseIf: false,
                },
            ],
            'no-empty-function': 'warn',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-implicit-coercion': [
                'warn',
                {
                    boolean: true,
                    number: true,
                    string: true,
                    disallowTemplateShorthand: true,
                },
            ],
            'no-implied-eval': 'error',
            'no-invalid-this': 'error',
            'no-iterator': 'error',
            'no-label-var': 'warn',
            'no-lone-blocks': 'error',
            'no-lonely-if': 'warn',
            'no-magic-numbers': [
                'warn',
                {
                    ignore: [-1, 0, 1, 2],
                    ignoreArrayIndexes: true,
                    ignoreDefaultValues: true,
                    ignoreClassFieldInitialValues: true,
                    enforceConst: true,
                    detectObjects: false,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                    ignoreReadonlyClassProperties: false,
                    ignoreTypeIndexes: true,
                },
            ],
            'no-multi-assign': [
                'error',
                {
                    ignoreNonDeclaration: false,
                },
            ],
            'no-multi-str': 'error',
            'no-negated-condition': 'warn',
            'no-nested-ternary': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-object-constructor': 'warn',
            'no-octal-escape': 'error',
            'no-param-reassign': [
                'error',
                {
                    props: false,
                },
            ],
            'no-plusplus': [
                'warn',
                {
                    allowForLoopAfterthoughts: false,
                },
            ],
            'no-proto': 'error',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ThrowStatement',
                    message: 'Throwing is not allowed. Prefer errors as values instead.',
                },
            ],
            'no-return-assign': ['error', 'always'],
            'no-script-url': 'error',
            'no-sequences': [
                'error',
                {
                    allowInParentheses: false,
                },
            ],
            'no-ternary': 'warn',
            'no-throw-literal': 'error',
            'no-undef-init': 'warn',
            'no-undefined': 'error',
            'no-unneeded-ternary': 'error',
            'no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: false,
                    allowTernary: false,
                    allowTaggedTemplates: true,
                    enforceForJSX: false,
                    ignoreDirectives: true,
                },
            ],
            'no-useless-call': 'error',
            'no-useless-computed-key': [
                'error',
                {
                    enforceForClassMembers: true,
                },
            ],
            'no-useless-concat': 'warn',
            'no-useless-constructor': 'error',
            'no-useless-rename': 'error',
            'no-useless-return': 'error',
            'no-var': 'error',
            'no-void': [
                'error',
                {
                    allowAsStatement: false,
                },
            ],
            'no-warning-comments': [
                'warn',
                {
                    terms: ['todo', 'fixme'],
                    location: 'anywhere',
                },
            ],
            'object-shorthand': ['error', 'consistent'],
            'one-var': ['error', 'never'],
            'prefer-arrow-callback': [
                'error',
                {
                    allowNamedFunctions: false,
                    allowUnboundThis: true,
                },
            ],
            'prefer-const': [
                'error',
                {
                    destructuring: 'any',
                    ignoreReadBeforeAssign: false,
                },
            ],
            'prefer-exponentiation-operator': 'warn',
            'prefer-named-capture-group': 'error',
            'prefer-numeric-literals': 'warn',
            'prefer-object-has-own': 'warn',
            'prefer-object-spread': 'warn',
            'prefer-promise-reject-errors': [
                'error',
                {
                    allowEmptyReject: false,
                },
            ],
            'prefer-regex-literals': [
                'warn',
                {
                    disallowRedundantWrapping: true,
                },
            ],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'warn',
            'preserve-caught-error': [
                'error',
                {
                    requireCatchParameter: true,
                },
            ],
            'radix': ['error', 'always'],
            'require-await': 'error',
            'sort-imports': [
                'error',
                {
                    'ignoreCase': false,
                    'ignoreDeclarationSort': false,
                    'ignoreMemberSort': false,
                    'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
                    'allowSeparatedGroups': false,
                },
            ],
            'symbol-description': 'error',
            'vars-on-top': 'error',
            'yoda': [
                'error',
                'never',
                {
                    exceptRange: true,
                },
            ],
            'unicode-bom': ['error', 'never'],
        },
    },
    /* Configuration for all TypeScript files */
    {
        files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
        rules: {
            // Disable redundant ESLint rules conflicting with typescript-eslint rules
            'default-param-last': 'off',
            'dot-notation': 'off',
            'max-params': 'off',
            'no-array-constructor': 'off',
            'no-empty-function': 'off',
            'no-magic-numbers': 'off',
            'no-unused-private-class-members': 'off',
            'no-use-before-define': 'off',
            'no-useless-constructor': 'off',

            // Enable TypeScript-specific rules
            '@typescript-eslint/adjacent-overload-signatures': 'error',
            '@typescript-eslint/array-type': [
                'warn',
                {
                    default: 'array',
                    readonly: 'array',
                },
            ],
            '@typescript-eslint/class-literal-property-style': ['warn', 'fields'],
            '@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
            '@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],
            '@typescript-eslint/consistent-type-assertions': [
                'warn',
                {
                    arrayLiteralTypeAssertions: 'allow',
                    assertionStyle: 'as',
                    objectLiteralTypeAssertions: 'allow',
                },
            ],
            '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
            '@typescript-eslint/consistent-type-exports': [
                'warn',
                {
                    fixMixedExportsWithInlineTypeSpecifier: true,
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
            '@typescript-eslint/default-param-last': 'error',
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'no-public',
                },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/max-params': [
                'error',
                {
                    max: 5,
                },
            ],
            '@typescript-eslint/member-ordering': [
                'warn',
                {
                    default: {
                        optionalityOrder: 'required-first',
                        order: 'natural-case-insensitive',
                    },
                },
            ],
            '@typescript-eslint/method-signature-style': ['warn', 'property'],
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'default',
                    format: ['strictCamelCase'],
                },
                {
                    selector: 'variable',
                    format: ['strictCamelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    modifiers: ['const'],
                    format: ['strictCamelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'parameter',
                    format: ['strictCamelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['strictCamelCase'],
                    leadingUnderscore: 'require',
                },
                {
                    selector: 'function',
                    format: ['strictCamelCase', 'StrictPascalCase'],
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: [
                        'classProperty',
                        'objectLiteralProperty',
                        'typeProperty',
                        'classMethod',
                        'objectLiteralMethod',
                        'typeMethod',
                        'accessor',
                        'enumMember',
                    ],
                    format: null,
                    modifiers: ['requiresQuotes'],
                },
            ],
            '@typescript-eslint/no-array-constructor': 'error',
            '@typescript-eslint/no-confusing-non-null-assertion': 'error',
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {
                    ignoreArrowShorthand: false,
                    ignoreVoidOperator: false,
                    ignoreVoidReturningFunctions: false,
                },
            ],
            '@typescript-eslint/no-deprecated': 'warn',
            '@typescript-eslint/no-dynamic-delete': 'error',
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-extraneous-class': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: false,
                    ignoreProperties: false,
                },
            ],
            '@typescript-eslint/no-invalid-void-type': 'error',
            '@typescript-eslint/no-magic-numbers': [
                'warn',
                {
                    ignore: [-1, 0, 1, 2],
                    ignoreArrayIndexes: true,
                    ignoreDefaultValues: true,
                    ignoreClassFieldInitialValues: true,
                    enforceConst: true,
                    detectObjects: false,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                    ignoreReadonlyClassProperties: false,
                    ignoreTypeIndexes: true,
                },
            ],
            '@typescript-eslint/no-meaningless-void-operator': [
                'error',
                {
                    checkNever: false,
                },
            ],
            '@typescript-eslint/no-misused-spread': 'error',
            '@typescript-eslint/no-mixed-enums': 'error',
            '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
                'error',
                {
                    allowComparingNullableBooleansToTrue: true,
                    allowComparingNullableBooleansToFalse: true,
                },
            ],
            '@typescript-eslint/no-unnecessary-condition': [
                'error',
                {
                    allowConstantLoopConditions: 'only-allowed-literals',
                    checkTypePredicates: false,
                },
            ],
            '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-unnecessary-template-expression': 'error',
            '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            '@typescript-eslint/no-unnecessary-type-conversion': 'error',
            '@typescript-eslint/no-unnecessary-type-parameters': 'error',
            '@typescript-eslint/no-unsafe-type-assertion': 'error',
            '@typescript-eslint/no-unused-private-class-members': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-use-before-define': [
                'error',
                {
                    functions: false,
                    classes: true,
                    variables: true,
                    allowNamedExports: false,
                    enums: true,
                    typedefs: true,
                    ignoreTypeReferences: true,
                },
            ],
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-useless-default-assignment': 'error',
            '@typescript-eslint/no-useless-empty-export': 'error',
            '@typescript-eslint/non-nullable-type-assertion-style': 'error',
            '@typescript-eslint/parameter-properties': [
                'error',
                {
                    allow: [],
                    prefer: 'class-property',
                },
            ],
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/prefer-find': 'error',
            '@typescript-eslint/prefer-for-of': 'warn',
            '@typescript-eslint/prefer-function-type': 'warn',
            '@typescript-eslint/prefer-includes': 'error',
            '@typescript-eslint/prefer-literal-enum-member': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': [
                'error',
                {
                    allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
                    ignoreBooleanCoercion: false,
                    ignoreConditionalTests: true,
                    ignoreIfStatements: false,
                    ignoreMixedLogicalExpressions: false,
                    ignorePrimitives: {
                        bigint: false,
                        boolean: false,
                        number: false,
                        string: false,
                    },
                    ignoreTernaryTests: false,
                },
            ],
            '@typescript-eslint/prefer-optional-chain': [
                'error',
                {
                    checkAny: true,
                    checkBigInt: true,
                    checkBoolean: true,
                    checkNumber: true,
                    checkString: true,
                    checkUnknown: true,
                    requireNullish: true,
                },
            ],
            '@typescript-eslint/prefer-reduce-type-parameter': 'error',
            '@typescript-eslint/prefer-return-this-type': 'error',
            '@typescript-eslint/prefer-string-starts-ends-with': [
                'error',
                {
                    allowSingleElementEquality: 'never',
                },
            ],
            '@typescript-eslint/promise-function-async': [
                'error',
                {
                    allowAny: true,
                    allowedPromiseNames: [],
                    checkArrowFunctions: true,
                    checkFunctionDeclarations: true,
                    checkFunctionExpressions: true,
                    checkMethodDeclarations: true,
                },
            ],
            '@typescript-eslint/related-getter-setter-pairs': 'error',
            '@typescript-eslint/require-array-sort-compare': [
                'error',
                {
                    ignoreStringArrays: true,
                },
            ],
            '@typescript-eslint/return-await': ['error', 'always'],
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowAny: false,
                    allowNullableBoolean: false,
                    allowNullableEnum: false,
                    allowNullableNumber: false,
                    allowNullableObject: true,
                    allowNullableString: false,
                    allowNumber: true,
                    allowString: true,
                },
            ],
            '@typescript-eslint/strict-void-return': [
                'error',
                {
                    allowReturnAny: false,
                },
            ],
            '@typescript-eslint/switch-exhaustiveness-check': [
                'error',
                {
                    allowDefaultCaseForExhaustiveSwitch: false,
                    requireDefaultForNonUnion: true,
                    considerDefaultExhaustiveForUnions: true,
                },
            ],
            '@typescript-eslint/unified-signatures': [
                'error',
                {
                    ignoreDifferentlyNamedParameters: true,
                    ignoreOverloadsWithDifferentJSDoc: true,
                },
            ],
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    },
]);
