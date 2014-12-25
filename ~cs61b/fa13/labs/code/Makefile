
LABS  = lab1 lab2 lab3 lab4 lab5 lab6 lab7

WRITEUPS = $(LABS:%=%/activities.txt)

PDFWRITEUPS = $(WRITEUPS:.txt=.pdf)

OTHERS = $(LABS) $(wildcard proj?) $(wildcard hw*) $(wildcard *.java) $(wildcard *.stuff)

REMOTEDIR = $(REMOTE_PREFIX)labs/code

.PHONY: default

default: $(PDFWRITEUPS)

include lib/handout.Makefile

%/activities.ps: %/activities.txt
	enscript -p $@ -2r $< 

%/activities.pdf: %/activities.ps
	ps2pdf $< $@

tidy::
	find . -name '*~' -exec rm -f {} \;

DIST_FLAGS = --exclude data --delete

dist:: default
