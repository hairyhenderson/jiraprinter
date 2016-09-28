REPORTER = spec

ifndef CIRCLE_TEST_REPORTS
CIRCLE_TEST_REPORTS=.
endif

test:
	$(MAKE) check-security
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/mocha -b --reporter $(REPORTER)

lint:
	./node_modules/.bin/dot-only-hunter
	./node_modules/.bin/standard

test-cov:
	$(MAKE) check-security
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha -- -R spec

test-ci:
	$(MAKE) check-security
	$(MAKE) lint
	@NODE_ENV=test NODE_PATH=lib XUNIT_FILE=$(CIRCLE_TEST_REPORTS)/mocha.xml \
	./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha --report lcovonly -- -R xunit-file
ifdef CODECLIMATE_REPO_TOKEN
	./node_modules/.bin/codeclimate-test-reporter < coverage/lcov.info
endif
ifdef CIRCLE_ARTIFACTS
	cp -av coverage $(CIRCLE_ARTIFACTS)
endif

check-security:
	./node_modules/.bin/nsp check

gen-changelog:
	github_changelog_generator --exclude-labels duplicate,question,invalid,wontfix,admin,greenkeeper

.PHONY: test lint test-cov test-ci gen-changelog
