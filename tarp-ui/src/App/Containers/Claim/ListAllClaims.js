import React, { Component } from "react";
import { Card, Table, Button, message, Tag } from "antd";
import { getAllClaims, getClaimProof } from "../../Models/ClaimRecords";
import ProcessModal from "../../Components/KYC/ProcessModal";
import { Link } from "react-router-dom";

export default class ListClaim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      Claim: []
    };
    this.columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Cost",
        dataIndex: "cost",
        key: "cost"
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt"
      },
      {
        title: "Insuree Name",
        dataIndex: "insureeDetails.name",
        key: "insureeDetails.name"
      },
      {
        title: "Insurer Name",
        dataIndex: "insurerDetails.name",
        key: "insurerDetails.name"
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Action",
        dataIndex: "actions",
        render: (text, record, index) => {
          return (
            <div style={{ display: "flex" }}>
              <Button
                type="primary"
                onClick={() => this.downloadProofs(record)}
              >
                View Proofs
              </Button>
            </div>
          );
        }
      }
    ];
  }

  downloadProofs = record => {
    this.setState({ loading: true });
    getClaimProof({
      claim_id: record.id,
      onSuccess: data => {
        data.response.forEach(element => {
          const link = document.createElement("a");
          link.setAttribute("href", element.record.url);
          link.setAttribute("target", "_blank");
          link.click();
        });
        message.success("Successfully downloaded proof");
        this.setState({
          loading: false
        });
      },
      onError: data => {
        this.setState({
          loading: false
        });
        console.log(data);

        message.error("Unable to download proof");
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRecord: null
    });
  };

  componentDidMount() {
    this.getAllClaims();
  }

  getAllClaims = () => {
    message.loading("Fetching claims from Blockchain Ledger...", 0);
    this.setState({ loading: true });
    getAllClaims({
      onSuccess: data => {
        this.setState({
          loading: false,
          Claim: data.response
        });
        message.destroy();
        message.success("Synced with Ledger!");
      },
      onError: data => {
        this.setState({
          loading: false
        });
        message.destroy();
        // message.error('Unable to Claim')
      }
    });
  };
  render() {
    return (
      <div>
        <Card
          title="List Of Claims"
          extra={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to="/client/claim/add-claim" />
            </div>
          }
        >
          <Table
            dataSource={this.state.Claim}
            columns={this.columns}
            loading={this.state.loading}
            rowKey="id"
          />
        </Card>
      </div>
    );
  }
}
