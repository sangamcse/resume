# Build Sangam Kumar's resume variants.
#
# Prerequisite (one time). No sudo needed -- installs into the user tree. The
# explicit repo is required because this machine runs TeX Live 2025 while the
# default tlmgr repository has moved on to 2026.
#   tlmgr init-usertree
#   tlmgr --usermode \
#     --repository https://ftp.math.utah.edu/pub/tex/historic/systems/texlive/2025/tlnet-final \
#     install titlesec enumitem fontawesome5
#
# Usage:
#   make          build both PDFs
#   make sse      build the Senior SWE variant only
#   make ai       build the AI Engineer variant only
#   make clean    remove LaTeX build artifacts

VARIANTS := SANGAM_KUMAR_SWE SANGAM_KUMAR_AI_ENGINEER
PDFS     := $(addsuffix .pdf,$(VARIANTS))
AUX_EXT  := aux log out fls fdb_latexmk synctex.gz

.PHONY: all sse ai clean
all: $(PDFS)

sse:  SANGAM_KUMAR_SWE.pdf
ai:   SANGAM_KUMAR_AI_ENGINEER.pdf

# Two passes so hyperref resolves; -halt-on-error so failures are loud.
%.pdf: %.tex resume-base.tex
	pdflatex -halt-on-error -interaction=nonstopmode $< >/dev/null
	pdflatex -halt-on-error -interaction=nonstopmode $< >/dev/null
	@echo "built $@ ($$(pdfinfo $@ 2>/dev/null | awk '/^Pages/{print $$2}') pages)"

clean:
	rm -f $(foreach v,$(VARIANTS),$(foreach e,$(AUX_EXT),$(v).$(e)))
