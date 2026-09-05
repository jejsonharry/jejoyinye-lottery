/*
=========================================================
JEJOYINYE LOTTERY SERVICES
AGENT OPPORTUNITY SECTION
Advantages + Agent Image + Requirements
=========================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // Prevent duplicate section
    if (document.getElementById("agent-opportunity-showcase")) {
        return;
    }

    // Find the existing application form/section
    const applicationSection =
        document.querySelector(".agent-application-section");

    const main =
        document.querySelector(".agent-page") ||
        document.querySelector("main") ||
        document.body;


    /* =====================================================
       CREATE AGENT OPPORTUNITY SECTION
    ===================================================== */

    const section = document.createElement("section");

    section.id = "agent-opportunity-showcase";
    section.className = "agent-opportunity-showcase";


    section.innerHTML = `

        <div class="agent-opportunity-container">


            <!-- =========================================
                 SECTION HEADING
            ========================================== -->

            <div class="agent-opportunity-heading">

                <span class="agent-small-title">
                    BECOME AN AGENT
                </span>

                <h2>
                    Build Your Lottery Business
                    With Jejoyinye
                </h2>

                <p>
                    Become part of our growing agent network
                    and operate lottery services with access
                    to multiple games, attractive commissions,
                    training and ongoing business support.
                </p>

            </div>


            <!-- =========================================
                 ADVANTAGES + IMAGE
            ========================================== -->

            <div class="agent-feature-layout">


                <!-- LEFT SIDE: WRITE-UP -->

                <div class="agent-advantages-side">

                    <span class="agent-green-label">
                        PARTNER • EARN • GROW
                    </span>

                    <h3>
                        Why Become A
                        Jejoyinye Lottery Agent?
                    </h3>

                    <p class="agent-introduction">

                        Becoming a Jejoyinye Lottery Services
                        agent gives you an opportunity to build
                        your own lottery business while serving
                        customers within your community.

                        You gain access to different lottery
                        products, attractive commissions,
                        training and continuous support to help
                        you operate professionally and grow
                        your customer base.

                    </p>


                    <div class="agent-benefits-list">


                        <!-- COMMISSION -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ₦
                            </div>

                            <div>

                                <h4>
                                    Attractive Commission
                                </h4>

                                <p>
                                    Earn commission from eligible
                                    lottery sales and increase your
                                    earnings as your sales and
                                    customer base grow.
                                </p>

                            </div>

                        </div>


                        <!-- BUSINESS -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ↗
                            </div>

                            <div>

                                <h4>
                                    Build Your Own Business
                                </h4>

                                <p>
                                    Operate from your approved
                                    business location and gradually
                                    build a regular customer base.
                                </p>

                            </div>

                        </div>


                        <!-- TRAINING -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ✓
                            </div>

                            <div>

                                <h4>
                                    Training & Support
                                </h4>

                                <p>
                                    Receive guidance on lottery
                                    games, terminal operation,
                                    customer service and general
                                    business activities.
                                </p>

                            </div>

                        </div>


                        <!-- MULTIPLE GAMES -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ★
                            </div>

                            <div>

                                <h4>
                                    Multiple Lottery Games
                                </h4>

                                <p>
                                    Give your customers access
                                    to available Modern Billionaire
                                    and Ghana lottery games.
                                </p>

                            </div>

                        </div>


                        <!-- TERMINAL -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ⚡
                            </div>

                            <div>

                                <h4>
                                    Lottery Terminal
                                </h4>

                                <p>
                                    Use a lottery terminal to
                                    serve customers efficiently
                                    and process approved lottery
                                    transactions.
                                </p>

                            </div>

                        </div>


                        <!-- NETWORK -->

                        <div class="agent-benefit">

                            <div class="agent-benefit-icon">
                                ◎
                            </div>

                            <div>

                                <h4>
                                    Growing Agent Network
                                </h4>

                                <p>
                                    Become part of a growing
                                    network of lottery operators
                                    supported by Jejoyinye
                                    Lottery Services.
                                </p>

                            </div>

                        </div>


                    </div>

                </div>


                <!-- RIGHT SIDE: AGENT IMAGE -->

                <div class="agent-image-side">

                    <img
                        src="Images/agent.jpeg"
                        alt="Prospective lottery agent holding a lottery terminal"
                    >

                    <div class="agent-image-information">

                        <strong>
                            Start Your Lottery Business
                        </strong>

                        <span>
                            Training • Support • Business Opportunity
                        </span>

                    </div>

                </div>


            </div>



            <!-- =========================================
                 REQUIREMENTS
            ========================================== -->

            <div class="agent-requirements-section">


                <div class="requirements-heading">

                    <span>
                        APPLICATION REQUIREMENTS
                    </span>

                    <h3>
                        What You Need To Become An Agent
                    </h3>

                    <p>
                        Have the following information ready
                        before completing your agent application.
                    </p>

                </div>


                <div class="requirements-grid">


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            01
                        </strong>

                        <div>

                            <h4>
                                Full Name
                            </h4>

                            <p>
                                Your correct full name as it
                                appears on your identification
                                documents.
                            </p>

                        </div>

                    </div>


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            02
                        </strong>

                        <div>

                            <h4>
                                NIN Number
                            </h4>

                            <p>
                                A valid 11-digit National
                                Identification Number for
                                identification and verification.
                            </p>

                        </div>

                    </div>


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            03
                        </strong>

                        <div>

                            <h4>
                                Active Phone Number
                            </h4>

                            <p>
                                Provide an active phone number
                                our team can use to contact you
                                concerning your application.
                            </p>

                        </div>

                    </div>


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            04
                        </strong>

                        <div>

                            <h4>
                                Business Address
                            </h4>

                            <p>
                                Provide the proposed location
                                where you intend to operate
                                the lottery business.
                            </p>

                        </div>

                    </div>


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            05
                        </strong>

                        <div>

                            <h4>
                                Bank Account Details
                            </h4>

                            <p>
                                Provide your bank name,
                                account name and valid
                                account number.
                            </p>

                        </div>

                    </div>


                    <div class="requirement-card">

                        <strong class="requirement-number">
                            06
                        </strong>

                        <div>

                            <h4>
                                Commitment To The Business
                            </h4>

                            <p>
                                You should be willing to learn
                                the games, follow operating
                                guidelines and serve customers
                                professionally.
                            </p>

                        </div>

                    </div>


                </div>




            </div>


        </div>

    `;



    /* =====================================================
       INSERT ABOVE EXISTING APPLICATION FORM
    ===================================================== */

    if (
        applicationSection &&
        applicationSection.parentNode
    ) {

        applicationSection.parentNode.insertBefore(
            section,
            applicationSection
        );

    } else {

        main.prepend(section);

    }



    /* =====================================================
       STYLING
    ===================================================== */

    const style = document.createElement("style");

    style.id = "agent-opportunity-style";


    style.textContent = `


        /* ================================================
           MAIN SECTION
        ================================================= */

       .agent-opportunity-showcase {
    padding: 75px 0;


      .agent-opportunity-container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding-left: 10px;
    padding-right: 20px;
}


        /* ================================================
           HEADING
        ================================================= */

        .agent-opportunity-heading {

            max-width: 800px;

            margin:
                0 auto
                45px;

            text-align: center;

        }


        .agent-small-title {

            display: inline-block;

            padding:
                7px
                14px;

            border-radius: 50px;

            background: #dcfce7;

            color: #15803d;

            font-size: 11px;

            font-weight: 900;

            letter-spacing: 1.3px;

        }


        .agent-opportunity-heading h2 {

            margin:
                15px
                0
                12px;

            color: #0f172a;

            font-size:
                clamp(
                    30px,
                    4vw,
                    46px
                );

            line-height: 1.1;

        }


        .agent-opportunity-heading p {

            margin: 0;

            color: #64748b;

            font-size: 16px;

            line-height: 1.75;

        }



        /* ================================================
           TWO COLUMN LAYOUT
        ================================================= */

     .agent-feature-layout {
    display: grid;
    grid-template-columns: minmax(360px, 40%) 1fr;
    gap: 24px;
    align-items: stretch;
}
/* IMAGE ON LEFT */
.agent-image-side {
    grid-column: 1;
    grid-row: 1;
}

/* WRITE-UP ON RIGHT */
.agent-advantages-side {
    grid-column: 2;
    grid-row: 1;
}



        /* ================================================
           LEFT WRITE-UP
        ================================================= */

        .agent-advantages-side {

            padding: 35px;

            border:
                1px solid
                #e2e8f0;

            border-radius: 24px;

            background: #ffffff;

            box-shadow:
                0 18px 45px
                rgba(15,23,42,.08);

        }


        .agent-green-label {

            color: #15803d;

            font-size: 11px;

            font-weight: 900;

            letter-spacing: 1.3px;

        }


        .agent-advantages-side > h3 {

            margin:
                10px
                0
                15px;

            color: #0f172a;

            font-size:
                clamp(
                    26px,
                    3vw,
                    36px
                );

            line-height: 1.15;

        }


        .agent-introduction {

            color: #64748b;

            line-height: 1.75;

            margin-bottom: 28px;

        }



        /* ================================================
           ADVANTAGES
        ================================================= */

        .agent-benefits-list {

            display: grid;

            grid-template-columns:
                1fr
                1fr;

            gap: 14px;

        }


        .agent-benefit {

            display: grid;

            grid-template-columns:
                45px
                1fr;

            gap: 12px;

            padding: 16px;

            border:
                1px solid
                #e5eaf0;

            border-radius: 16px;

            background:
                linear-gradient(
                    180deg,
                    #ffffff,
                    #f8fafc
                );

        }


        .agent-benefit-icon {

            width: 45px;

            height: 45px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 13px;

            background:
                linear-gradient(
                    145deg,
                    #20b956,
                    #107a38
                );

            color: white;

            font-size: 19px;

            font-weight: 900;

            box-shadow:
                0 7px 17px
                rgba(22,163,74,.20);

        }


        .agent-benefit h4 {

            margin:
                0
                0
                5px;

            color: #0f172a;

            font-size: 15px;

        }


        .agent-benefit p {

            margin: 0;

            color: #64748b;

            font-size: 13px;

            line-height: 1.6;

        }



        /* ================================================
           AGENT IMAGE
        ================================================= */

        .agent-image-side {

            position: relative;

            min-height: 570px;

            overflow: hidden;

            border-radius: 24px;

            background:
                linear-gradient(
                    145deg,
                    #052718,
                    #0a4d2e
                );

            box-shadow:
                0 18px 45px
                rgba(15,23,42,.13);

        }


        .agent-image-side img {

            width: 100%;

            height: 100%;

            position: absolute;

            inset: 0;

            object-fit: cover;

            object-position:
                center top;

        }


        .agent-image-information {

            position: absolute;

            left: 22px;

            right: 22px;

            bottom: 22px;

            padding:
                17px
                18px;

            border:
                1px solid
                rgba(255,255,255,.20);

            border-radius: 15px;

            background:
                rgba(5,18,30,.78);

            color: white;

            backdrop-filter:
                blur(12px);

        }


        .agent-image-information strong {

            display: block;

            margin-bottom: 4px;

            font-size: 16px;

        }


        .agent-image-information span {

            color: #cbd5e1;

            font-size: 12px;

        }



        /* ================================================
           REQUIREMENTS
        ================================================= */

        .agent-requirements-section {

            margin-top: 35px;

            padding: 35px;

            border:
                1px solid
                #e2e8f0;

            border-radius: 24px;

            background: #ffffff;

            box-shadow:
                0 18px 45px
                rgba(15,23,42,.08);

        }


        .requirements-heading {

            max-width: 700px;

            margin-bottom: 25px;

        }


        .requirements-heading span {

            display: inline-block;

            padding:
                7px
                13px;

            border-radius: 50px;

            background: #dcfce7;

            color: #15803d;

            font-size: 11px;

            font-weight: 900;

            letter-spacing: 1.2px;

        }


        .requirements-heading h3 {

            margin:
                12px
                0
                8px;

            color: #0f172a;

            font-size:
                clamp(
                    25px,
                    3vw,
                    34px
                );

        }


        .requirements-heading p {

            color: #64748b;

        }



        .requirements-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap: 15px;

        }


        .requirement-card {

            display: grid;

            grid-template-columns:
                43px
                1fr;

            gap: 12px;

            padding: 18px;

            border:
                1px solid
                #e5eaf0;

            border-radius: 16px;

            background: #f8fafc;

        }


        .requirement-number {

            width: 43px;

            height: 43px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background: #0f172a;

            color: white;

            font-size: 12px;

        }


        .requirement-card h4 {

            margin:
                0
                0
                5px;

            color: #0f172a;

        }


        .requirement-card p {

            margin: 0;

            color: #64748b;

            font-size: 13px;

            line-height: 1.6;

        }



        /* ================================================
           APPLICATION BUTTON
        ================================================= */

        .agent-apply-button {

            display: inline-flex;

            margin-top: 28px;

            padding:
                14px
                23px;

            border-radius: 11px;

            background:
                linear-gradient(
                    180deg,
                    #22b956,
                    #13863f
                );

            color: white;

            text-decoration: none;

            font-weight: 850;

            box-shadow:
                0 9px 20px
                rgba(22,163,74,.22);

            transition:
                transform .2s ease,
                box-shadow .2s ease;

        }


        .agent-apply-button:hover {

            transform:
                translateY(-2px);

            box-shadow:
                0 13px 26px
                rgba(22,163,74,.30);

        }



        /* ================================================
           TABLET
        ================================================= */

        @media (
            max-width: 900px
        ) {

            .agent-feature-layout {

                grid-template-columns:
                    1fr;

            }


            .agent-image-side {

                min-height: 500px;

            }


            .requirements-grid {

                grid-template-columns:
                    1fr
                    1fr;

            }

        }



        /* ================================================
           MOBILE
        ================================================= */

        @media (
            max-width: 620px
        ) {

            .agent-opportunity-showcase {

                padding:
                    55px
                    14px;

            }


            .agent-advantages-side,
            .agent-requirements-section {

                padding: 22px;

            }


            .agent-benefits-list,
            .requirements-grid {

                grid-template-columns:
                    1fr;

            }


            .agent-image-side {

                min-height: 430px;

            }
.agent-image-side {
    grid-column: auto;
    grid-row: auto;
}

.agent-advantages-side {
    grid-column: auto;
    grid-row: auto;
}
        }

    `;


    document.head.appendChild(style);

});