# This makefile is defined to give you the following targets:
#
#    default: The default target: Compiles $(PROG) and whatever it 
#	   depends on.
#    check: Compile $(PROG), if needed, and then for each file, F, listed in 
#	   $(TESTS), use F.in as input to "java $(MAIN_CLASS)" and
#          compare the output to the contents of the file names F.out.
#          Report discrepencies.
#    clean: Remove all the .class files produced by java compilation, 
#          all Emacs backup files, and testing output files.
#
# In other words, type 'gmake' to compile everything; 'gmake check' to 
# compile and test everything, and 'gmake clean' to clean things up.
# 
# You can use this file without understanding most of it, of course, but
# I strongly recommend that you try to figure it out, and where you cannot,
# that you ask questions.  The Lab Reader contains documentation.

# Name of class containing main procedure 
MAIN = pcalc

# List all .java files used here.
SRCS = pcalc.java Defns.java ParseException.java algebra/Polynomial.java 

# List tests here.  For each name, BAR, in this list, there should be an
# input file BAR.in, and a comparison file BAR.out.
# (ADD MORE!  End a line with \ to continue it, if needed.)
TESTS = test1 test2 $(MYTESTS:%=mytests/%)

MYTESTS = test03 test04 test05 test06 test07 test08 test09 test10 \
	  test11 test12 test13 test14 test15 test16 test17 test18 test19 \
	  test20 test21 test22

# .java file containing the main program.
MAIN_SRC = $(MAIN).java

#### YOU SHOULDN'T HAVE TO CHANGE BELOW HERE ####

.PHONY: default check clean

# First, and therefore default, target.
default: $(MAIN).class

# Main class must be recompiled whenever (a) it is missing or
# (b) any of the SRCS have been changed more recently than it has.
# Use javac to recompile.
$(MAIN).class: $(SRCS)
	javac -g -source 1.4 $(SRCS)

# 'make check' will test run the tests in TESTS.  
check: $(MAIN).class
	@echo "Testing application $(MAIN)..."
	@rm -f OUTPUT1 OUTPUT2 
	@for f in $(TESTS); do \
	   if java $(MAIN) < $$f.in > OUTPUT1 2>&1 && \
	      ./test-filter < OUTPUT1 > OUTPUT2 && \
	      ./test-filter < $$f.out | diff - OUTPUT2; then \
	       echo "Test $$f passed."; \
	   else \
	       echo "Test $$f failed."; \
	   fi; \
	done
	@rm -f OUTPUT1 OUTPUT2 

# 'make clean' will clean up stuff you can reconstruct.
clean:
	rm -f *~ */*~ *.class */*.class OUTPUT*

$(ARCH)/pcalc: $(SRCS)
	@if [ ! -d $(ARCH) ]; then \
	   echo mkdir -p $(ARCH); mkdir -p $(ARCH); \
        fi
	gcj -o $(ARCH)/pcalc --main=pcalc $(SRCS)

install: $(ARCH)/pcalc
	cp -p $(ARCH)/pcalc $(HOME)/bin/arch/$(ARCH) 
