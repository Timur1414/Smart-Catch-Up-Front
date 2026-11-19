export interface DigestCategoryProps {
    header: string;
    content: string;
    isOpen?: boolean;
}

export function create_digest_category_element(props: DigestCategoryProps): HTMLElement {
    const container = document.createElement("div");
    container.className = "scu-digest-category_container";
    if (props.isOpen) {
        container.classList.add("scu-digest-category_open");
    }

    const header = document.createElement("div");
    header.className = "scu-digest-category_header";

    const headerText = document.createElement("p");
    headerText.className = "scu-digest-category_header_text";
    headerText.textContent = props.header;

    const arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowSvg.setAttribute("class", "scu-digest-category_header_arrow" + (props.isOpen ? " scu-digest-category_header_arrow_open" : ""));
    arrowSvg.setAttribute("width", "16");
    arrowSvg.setAttribute("height", "16");
    arrowSvg.setAttribute("viewBox", "0 0 24 24");
    arrowSvg.setAttribute("fill", "none");
    arrowSvg.setAttribute("stroke", "currentColor");
    arrowSvg.setAttribute("stroke-width", "2.5");
    arrowSvg.setAttribute("stroke-linecap", "round");
    arrowSvg.setAttribute("stroke-linejoin", "round");

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "6 9 12 15 18 9");
    arrowSvg.appendChild(polyline);

    header.appendChild(headerText);
    header.appendChild(arrowSvg);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "scu-digest-category_content";

    const contentText = document.createElement("p");
    contentText.className = "scu-digest-category_content_text";
    contentText.textContent = props.content;

    contentWrapper.appendChild(contentText);

    container.appendChild(header);
    container.appendChild(contentWrapper);

    container.addEventListener("click", () => {
        const isOpen = container.classList.toggle("scu-digest-category_open");
        arrowSvg.classList.toggle("scu-digest-category_header_arrow_open", isOpen);
    });

    return container;
}

export class DigestCategory {
    private props: DigestCategoryProps;
    private element: HTMLElement | null = null;

    constructor(props: DigestCategoryProps) {
        this.props = props;
    }

    render(parent?: HTMLElement): HTMLElement {
        this.element = create_digest_category_element(this.props);
        if (parent) {
            parent.appendChild(this.element);
        }
        return this.element;
    }

    getElement(): HTMLElement | null {
        return this.element;
    }
}
